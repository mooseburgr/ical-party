"use client";

import { Box, Grid, TextField } from "@mui/material";
import { useState } from "react";
import Calendar from "@/components/Calendar";

export default function CalendarPreviewPage() {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setInputValue(event.target.value);
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
            value={inputValue}
            onChange={handleInputChange}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Calendar
            icalUrl={`/api/proxy?url=${encodeURIComponent(inputValue)}`}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
