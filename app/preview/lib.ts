import type { SchedulerEvent } from "@mui/x-scheduler/models";
import { parseIcsCalendar } from "@ts-ics/schema-zod";
import type { IcsCalendar } from "ts-ics";

export async function fetchCalendarEvents(
  url: string,
): Promise<SchedulerEvent[]> {
  if (isBlank(url)) return [];

  // TODO need to proxy this? `/api/proxy?url=${encodeURIComponent(httpsUrl)}`
  const icalResp = await fetch(url).then((resp) => resp.text());

  const calendarParsed: IcsCalendar = parseIcsCalendar(icalResp);
  const events: SchedulerEvent[] | undefined = calendarParsed.events?.map(
    (e) => {
      const allDay = e.start.type === "DATE";
      return {
        id: e.uid,
        title: e.summary,
        description: e.description,
        start: e.start.date.toISOString(),
        end: allDay
          ? e.start.date.toISOString()
          : e.end?.date.toISOString() || "",
        allDay: allDay,
        readOnly: true,
        location: e.location,
      };
    },
  );
  return events || [];
}

export function isBlank(str: string | null) {
  return !str || /^\s*$/.test(str);
}
