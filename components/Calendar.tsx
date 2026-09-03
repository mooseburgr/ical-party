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
import iCalendarPlugin from "@fullcalendar/icalendar";
import EventCalendar from "@fullcalendar/mui/classic/EventCalendar";
import {
  type EventApi,
  type EventClickInfo,
  useCalendarController,
} from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/react/daygrid";
import interactionPlugin from "@fullcalendar/react/interaction";
import listPlugin from "@fullcalendar/react/list";
import themePlugin from "@fullcalendar/react/themes/classic";
import timeGridPlugin from "@fullcalendar/react/timegrid";
import rrulePlugin from "@fullcalendar/rrule";
import LocationPinIcon from "@mui/icons-material/LocationPin";
import useMediaQuery from "@mui/material/useMediaQuery";
import Linkify from "linkify-react";
import { useMemo, useState } from "react";

import "@fullcalendar/react/skeleton.css";
import "@fullcalendar/mui/classic/theme.css";

// import "@fullcalendar/react/themes/classic/palette.css";

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
  // TODO useQueryState to store selected view, date, etc? (+ event ID!)

  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  // ensure it's http[s] protocol for our fetch-proxier
  const httpsUrl = icalUrl.replace("webcal://", "https://");
  const eventsSource = useMemo(
    () => ({
      url: `/api/proxy?url=${encodeURIComponent(httpsUrl)}`,
      format: "ics",
    }),
    [httpsUrl],
  );
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventApi | null>(null);

  const eventClickHandler = (info: EventClickInfo) => {
    setSelectedEvent(info.event);
    console.log(JSON.stringify(info.event, null, 2));
  };
  const loadingHandler = (isLoading: boolean) => {
    setIsLoading(isLoading);
  };
  const handleClose = () => setSelectedEvent(null);

  const _controller = useCalendarController();

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
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
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
        <EventCalendar
          // headerToolbar={{
          //   left: "today prev,next",
          //   center: "title",
          //   right: "dayGridMonth,timeGridWeek,listWeek",
          // }}
          // footerToolbar={{
          //   left: "today prev,next",
          // }}
          headerToolbarClass={"event-cal-header-toolbar"}
          footerToolbarClass={"event-cal-footer-toolbar"}
          aspectRatio={2}
          plugins={[
            themePlugin,
            interactionPlugin,
            dayGridPlugin,
            timeGridPlugin,
            listPlugin,
            iCalendarPlugin,
            rrulePlugin,
          ]}
          initialView={isMobile ? "listWeek" : "dayGridMonth"}
          loading={loadingHandler}
          events={eventsSource}
          eventClick={eventClickHandler}
          nowIndicator={true}
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
