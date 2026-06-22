import type { SchedulerEvent } from "@mui/x-scheduler/models";
import { parseIcsCalendar } from "@ts-ics/schema-zod";
import { generateIcsRecurrenceRule, type IcsCalendar } from "ts-ics";

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
      const isAllDay = e.start.type === "DATE";

      let desc = e.description || "";
      if (e.location) {
        desc += `\n\nLocation: ${e.location}`;
      }

      const start = e.start.date;
      if (isAllDay) {
        // unclear why the component needs this adjustment
        start.setDate(start.getDate() + 1);
      }
      let rrule: string | undefined;
      if (e.recurrenceRule) {
        rrule = generateIcsRecurrenceRule(e.recurrenceRule);
      }

      return {
        id: e.uid,
        title: e.summary,
        description: desc,
        rrule: rrule,
        start: start.toISOString(),
        end: e.end?.date.toISOString() || "",
        allDay: isAllDay,
        location: e.location, // not yet implemented
      };
    },
  );
  return events || [];
}

export function isBlank(str: string | null) {
  return !str || /^\s*$/.test(str);
}
