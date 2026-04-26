import { Box, Grid } from "@mui/material";
import { fetchCalendarEvents } from "@/app/preview/lib";
import Calendar from "@/components/Calendar";

export default async function CalendarPreviewPage() {
  const url =
    "https://calendar.proton.me/api/calendar/v1/url/lAcCdPSWROtdPo1dUfjWGB_FJZcNf9JArC861h8-206MWma8sfRHBvvG7RC5van9DaXVi9vMQ8Uw2_QiaNz5TA==/calendar.ics?CacheKey=LGnBXh7pTOwrk2Sl10A3BQ%3D%3D&PassphraseKey=SafnkL5vIcBrBIhEliG41g2oQG9WfaCdO9THDkjROnA%3D";

  const events = await fetchCalendarEvents(url);

  return (
    <Box sx={{ p: 4 }}>
      <Grid container spacing={2}>
        <h1>NE/SE Community Calendar</h1>

        <Grid size={{ xs: 12 }}>
          <Calendar
            icalUrl={url}
            events={events}
            submissionsUrl={"https://dub.sh/submit-nese-event"}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
