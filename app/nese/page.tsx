"use client";

import { Box, Grid } from "@mui/material";
import Calendar from "@/components/Calendar";

export default function CalendarPreviewPage() {
  const httpsUrl =
    "https://calendar.proton.me/api/calendar/v1/url/lAcCdPSWROtdPo1dUfjWGB_FJZcNf9JArC861h8-206MWma8sfRHBvvG7RC5van9DaXVi9vMQ8Uw2_QiaNz5TA==/calendar.ics?CacheKey=LGnBXh7pTOwrk2Sl10A3BQ%3D%3D&PassphraseKey=SafnkL5vIcBrBIhEliG41g2oQG9WfaCdO9THDkjROnA%3D";
  return (
    <Box sx={{ p: 4 }}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <Calendar icalUrl={httpsUrl} />
        </Grid>
      </Grid>
    </Box>
  );
}
