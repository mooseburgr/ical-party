import parser from "any-date-parser";
import * as cheerio from "cheerio";
import { minify } from "html-minifier-terser";
import pino from "pino";
import * as ics from "ts-ics";
import { lb } from "@/app/api/pwhl/lib";
import { revalidate } from "@/app/api/tkers/route";
import type { LeagueLabEvent } from "@/app/api/tkers/types";

const logger = pino();

// TODO remove 875437
export const tkersTeamIds = [875437, 879554];

export async function getScheduleEventsForTeamId(
  teamId: number,
): Promise<LeagueLabEvent[]> {
  const resp = await fetch(`https://cscsports.leaguelab.com/team/${teamId}`, {
    cache: "force-cache",
    next: {
      revalidate: revalidate,
    },
  });
  const teamPage = await minify(await resp.text(), {
    collapseWhitespace: true,
  });
  const $html = cheerio.load(teamPage);
  const teamName = $html("div.teamNameRow > h1").text().trim();
  const scheduleTable = $html("#teamScheduleTable > tbody");

  const splitEvents: LeagueLabEvent[] = [];
  scheduleTable.children().each((i, el) => {
    const $tr = $html(el);

    const event: LeagueLabEvent = {
      teamId,
      teamName,
      date: $tr.find("td.gameDate h4").text().trim(),

      gameId: $tr.attr("id"),
      time: $tr.find("td.gameTime").text().trim(),
      location: $tr.find("td.gameLocation a").text().trim(),
      locationId: $tr.find("td.gameLocation a").attr("href")?.split("/").pop(),
      field: $tr.find("td.gameLocation").contents().last().text().trim(),
      opponent: $tr.find("td.opponent a").text().trim(),
      homeOrVisitor: $tr.find("div.homeOrVisitor").text().trim(),
      result: $tr.find("td.result").html()?.trim(),
    };

    logger.debug(`${i}: ${$tr} - mapped to: ${JSON.stringify(event)}`);
    splitEvents.push(event);
  });

  const joinedEvents: LeagueLabEvent[] = [];
  let wipEvent: LeagueLabEvent = { teamId, teamName };
  splitEvents.forEach((event) => {
    if (!event.gameId) {
      // if no game ID, assume date row, indicating start of new event
      wipEvent = event;
    } else {
      // spread the second row's data into the WIP event, keeping date
      wipEvent = {
        ...event,
        date: wipEvent.date,
        leagueId: getLeagueIdFromGameId(event.gameId),
      };

      joinedEvents.push(wipEvent);
    }
  });

  return joinedEvents;
}

export async function getAllScheduleEvents(): Promise<ics.IcsEvent[]> {
  const allEvents: ics.IcsEvent[] = [];
  for (const t of tkersTeamIds) {
    const events = await getScheduleEventsForTeamId(t);
    for (const e of events) {
      allEvents.push(mapToIcsEvent(e));
    }
  }
  return allEvents;
}

export function mapToIcsEvent(event: LeagueLabEvent): ics.IcsEvent {
  const start = getStartDateTime(event);
  const startObject: ics.IcsDateObject = {
    date: start,
    type: "DATE-TIME",
  };

  const description =
    `${event.teamName} (${event.homeOrVisitor}) vs ${event.opponent}` +
    `${lb}${event.date} - ${event.time}` +
    `${lb}${event.location} - ${event.field}` +
    `${lb}${lb}Result: ${event.result ?? "TBD"}`;

  const result: ics.IcsEvent = {
    summary: `${event.teamName} vs ${event.opponent} @ ${event.location} - ${event.field}`,
    uid: event.gameId ?? `${event.teamId}-${event.date}-${event.time}`,
    stamp: startObject,
    start: startObject,
    duration: { hours: 1 },
    location: event.location,
    description: description,
    url: `https://cscsports.leaguelab.com/team/${event.teamId}`,
    status: "CONFIRMED",
  };
  logger.debug({ event, result }, "mapped LeagueLabEvent to ics.IcsEvent");
  return result;
}

export function getStartDateTime(game: Partial<LeagueLabEvent>): Date {
  const currentYear = new Date().getFullYear();
  // convert "Thursday, July 3 2025 at 7:40 PM" to a Date object
  const result = parser.fromString(
    `${game.date}, ${currentYear} at ${game.time}`,
    "en-US",
  );
  if (result.isValid()) {
    return new Date(result.toISOString());
  }

  // default to epoch time if invalid date
  return new Date(0);
}

function getLeagueIdFromGameId(gameId: string): string {
  return gameId.substring(gameId.lastIndexOf("_") + 1);
}

function _getAddress(event: LeagueLabEvent): string | undefined {
  // TODO get address
  //https://cscsports.leaguelab.com/location/6916

  return event.location;
}

export function generateIcalContent(icsEvents: ics.IcsEvent[]): string {
  return ics.generateIcsCalendar({
    prodId: `-//ical-party//leaguelab//tkers//EN`,
    version: "2.0",
    events: icsEvents,
    name: `Thursday Kickers Schedule`,
  });
}
