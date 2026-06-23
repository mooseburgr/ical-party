"use client";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  LinearProgress,
} from "@mui/material";
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

      <Dialog open={isLoading}>
        <DialogTitle>Loading events...</DialogTitle>
        <DialogContent>
          <LinearProgress aria-label="Loading…" sx={{ mt: 2 }} />
        </DialogContent>
      </Dialog>

      <Dialog open={selectedEvent !== null} onClose={handleClose}>
        <DialogTitle>{selectedEvent?.title}</DialogTitle>
        <DialogContent dividers>
          <DialogContentText>
            {selectedEvent?.allDay
              ? selectedEvent.start?.toLocaleDateString()
              : `${selectedEvent?.start?.toLocaleString()} - ${selectedEvent?.end?.toLocaleTimeString()}`}

            {selectedEvent?.extendedProps?.location && (
              <p>
                <a
                  href={`https://www.google.com/maps/search/${selectedEvent.extendedProps.location}/`}
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
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>

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
          initialView="listMonth"
          loading={loadingHandler}
          events={eventsSource}
          eventClick={eventClickHandler}
          height={"auto"}
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
