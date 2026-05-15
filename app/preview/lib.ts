import type { SchedulerEvent } from "@mui/x-scheduler/models";
import { parseIcsCalendar } from "@ts-ics/schema-zod";
import type { IcsCalendar } from "ts-ics";

export async function fetchCalendarEvents(
  url: string,
): Promise<SchedulerEvent[]> {
  if (isBlank(url)) return [];

  // cache for 10 minutes
  const icalResp = await fetch(url, { next: { revalidate: 600 } }).then(
    (resp) => resp.text(),
  );

  const calendarParsed: IcsCalendar = parseIcsCalendar(icalResp);
  const events: SchedulerEvent[] | undefined = calendarParsed.events?.map(
    (e) => {
      const allDay = e.start.type === "DATE";

      let desc = e.description || "";
      if (e.location) {
        desc += `\n\nLocation: ${e.location}`;
      }

      const start = e.start.date;
      if (allDay) {
        // unclear why the component needs this adjustment
        start.setDate(start.getDate() + 1);
      }

      return {
        id: e.uid,
        title: e.summary,
        description: desc,
        start: start.toISOString(),
        end: e.end?.date.toISOString() || "",
        allDay: allDay,
        location: e.location, // not yet implemented
      };
    },
  );
  return events || [];
}

export function isBlank(str: string | null) {
  return !str || /^\s*$/.test(str);
}
