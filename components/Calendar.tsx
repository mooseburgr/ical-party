"use client";

import { Box, Grid, LinearProgress, Modal, Typography } from "@mui/material";
import type { SchedulerEvent } from "@mui/x-scheduler/models";
import SubButtons from "@/components/SubButtons";
import "../app/globals.css";
import type { EventClickArg } from "@fullcalendar/core";
import type { EventImpl } from "@fullcalendar/core/internal";
import dayGridPlugin from "@fullcalendar/daygrid";
import iCalendarPlugin from "@fullcalendar/icalendar";
import listPlugin from "@fullcalendar/list";
import FullCalendar from "@fullcalendar/react";
import rrulePlugin from "@fullcalendar/rrule";
import timeGridPlugin from "@fullcalendar/timegrid";
import LocationPinIcon from "@mui/icons-material/LocationPin";
import Linkify from "linkify-react";
import { useMemo, useState } from "react";

interface CalendarProps {
  icalUrl: string;
  events: SchedulerEvent[] | undefined;
  submissionsUrl?: string;
}

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function Calendar({
  icalUrl,
  events,
  submissionsUrl,
}: Readonly<CalendarProps>) {
  // TODO useQueryState to store selected view, date, etc?

  const eventsSource = useMemo(
    () => ({
      url: `/api/proxy?url=${encodeURIComponent(icalUrl)}`,
      format: "ics",
    }),
    [icalUrl],
  );
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventImpl | null>(null);

  const eventClickHandler = (info: EventClickArg) => {
    setSelectedEvent(info.event);
  };
  const loadingHandler = (isLoading: boolean) => {
    setIsLoading(isLoading);
  };
  const handleClose = () => setSelectedEvent(null);

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12 }}>
        <SubButtons icalUrl={icalUrl} submissionsUrl={submissionsUrl} />
      </Grid>

      <Modal open={isLoading}>
        <Box sx={modalStyle}>
          <Typography variant="h6" component="h2">
            Loading events...
          </Typography>
          <LinearProgress aria-label="Loading…" sx={{ mt: 2 }} />
        </Box>
      </Modal>

      <Modal open={selectedEvent !== null} onClose={handleClose}>
        <Box sx={modalStyle}>
          <Typography variant="h5" component="h2">
            {selectedEvent?.title}
          </Typography>
          <p>
            {selectedEvent?.allDay
              ? selectedEvent.start?.toLocaleDateString()
              : `${selectedEvent?.start?.toLocaleString()} - ${selectedEvent?.end?.toLocaleTimeString()}`}
          </p>

          {selectedEvent?.extendedProps?.location && (
            <p>
              <a
                href={`https://www.google.com/maps/search/?q=${selectedEvent.extendedProps.location}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <LocationPinIcon /> {selectedEvent.extendedProps.location}
              </a>
            </p>
          )}

          {selectedEvent?.extendedProps.description && (
            <p style={{ whiteSpace: "pre-wrap" }}>
              <Linkify
                options={{ target: "_blank", rel: "noopener noreferrer" }}
              >
                {selectedEvent.extendedProps.description}
              </Linkify>
            </p>
          )}
        </Box>
      </Modal>

      <Grid size={{ xs: 12 }}>
        <FullCalendar
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,listMonth",
          }}
          plugins={[
            dayGridPlugin,
            timeGridPlugin,
            listPlugin,
            iCalendarPlugin,
            rrulePlugin,
          ]}
          initialView="dayGridMonth"
          loading={loadingHandler}
          events={eventsSource}
          eventClick={eventClickHandler}
        />
      </Grid>

      {/*
      <Grid size={{ xs: 12 }}>
        <EventCalendar
          events={events}
          readOnly={true}
          defaultPreferences={{
            isSidePanelOpen: false,
            showEmptyDaysInAgenda: false,
          }}
          defaultView="month"
          eventColor="orange"
        />
      </Grid>
      */}
    </Grid>
  );
}
