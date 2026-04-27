import { Grid } from "@mui/material";
import { EventCalendar } from "@mui/x-scheduler/event-calendar";
import type { SchedulerEvent } from "@mui/x-scheduler/models";
import SubButtons from "@/components/SubButtons";

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
  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12 }}>
        <SubButtons icalUrl={icalUrl} submissionsUrl={submissionsUrl} />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <EventCalendar
          events={events}
          readOnly={true}
          defaultPreferences={{ isSidePanelOpen: false }}
          defaultView="month"
        />
      </Grid>
    </Grid>
  );
}
