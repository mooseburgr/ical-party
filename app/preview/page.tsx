"use client";

import { Box, Grid, TextField } from "@mui/material";
import type { SchedulerEvent } from "@mui/x-scheduler/models";
import { useQueryState } from "nuqs";
import type React from "react";
import { useState } from "react";
import { fetchCalendarEvents } from "@/app/preview/lib";
import Calendar from "@/components/Calendar";

export default function CalendarPreviewPage() {
  const [url, setUrl] = useQueryState("url", {
    defaultValue: "",
  });
  const [events, setEvents] = useState<SchedulerEvent[]>();

  const handleInputChange = async (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    await setUrl(event.target.value);
    setEvents(await fetchCalendarEvents(event.target.value));
  };

  return (
    <Box sx={{ p: 4 }}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <TextField
            variant="outlined"
            fullWidth
            label="ICS/iCal feed URL"
            placeholder="https://example.com/calendar.ics"
            value={url}
            onChange={handleInputChange}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Calendar icalUrl={url} events={events} />
        </Grid>
      </Grid>
    </Box>
  );
}
