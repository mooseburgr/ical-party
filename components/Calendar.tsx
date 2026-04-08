"use client";

import dayGridPlugin from "@fullcalendar/daygrid";
import iCalendarPlugin from "@fullcalendar/icalendar";
import listPlugin from "@fullcalendar/list";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { Box, Button, Grid } from "@mui/material";

interface CalendarProps {
  icalUrl: string;
}

export default function Calendar({ icalUrl }: Readonly<CalendarProps>) {
  const httpsUrl = icalUrl.startsWith("https://")
    ? icalUrl
    : icalUrl.replace("http://", "https://").replace("webcal://", "https://");
  const webcalUrl = httpsUrl.replace("https", "webcal");

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12 }}>
        <h4>TODO: show popover with event details on click!</h4>
        <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            href={`https://calendar.google.com/calendar/u/0/r?cid=${encodeURIComponent(webcalUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            disabled={!httpsUrl}
          >
            Subscribe in Google Calendar
          </Button>
          <Button
            variant="contained"
            color="secondary"
            href={webcalUrl}
            target="_blank"
            rel="noopener noreferrer"
            disabled={!httpsUrl}
          >
            Subscribe in Other Calendar
          </Button>
        </Box>
      </Grid>

      <Grid size={{ xs: 12 }}>
        <FullCalendar
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,dayGridWeek,listWeek",
          }}
          plugins={[dayGridPlugin, timeGridPlugin, listPlugin, iCalendarPlugin]}
          initialView="dayGridMonth"
          events={{
            url: `/api/proxy?url=${encodeURIComponent(httpsUrl)}`,
            format: "ics",
          }}
        />
      </Grid>
    </Grid>
  );
}
