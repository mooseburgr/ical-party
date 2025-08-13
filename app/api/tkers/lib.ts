import parser from "any-date-parser";
import * as cheerio from "cheerio";
import { minify } from "html-minifier-terser";
import { DateTime } from "luxon";
import objectHash from "object-hash";
import pino from "pino";
import * as ics from "ts-ics";
import { revalidate } from "@/app/api/tkers/route";
import type { LeagueLabEvent } from "@/app/api/tkers/types";

const logger = pino();
const lb = "\n";

export const tkersTeamIds = [879554, 897061];

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
    if ($tr.text().trim() === "PLAYOFFS") {
      logger.debug(`${i}: ${$tr} - discarding playoffs banner row`);
      return;
    }

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
      result: cleanGameResult($tr.find("td.result").html()?.trim()),
    };

    logger.debug(`${i}: ${$tr} - mapped to: ${JSON.stringify(event)}`);
    splitEvents.push(event);
  });

  const joinedEvents: LeagueLabEvent[] = [];
  let wipEvent: LeagueLabEvent = { teamId, teamName };

  for (const event of splitEvents) {
    if (!event.gameId) {
      // if no game ID, assume date row, indicating start of new event
      wipEvent = event;
    } else {
      // spread the second row's data into the WIP event, keeping date
      wipEvent = {
        ...event,
        date: wipEvent.date,
        leagueId: getLeagueIdFromGameId(event.gameId),
        locationAddress: await getAddress(event),
      };

      joinedEvents.push(wipEvent);
    }
  }

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
  // hash the whole event so a new UID is generated if anything changes
  const uid = `${event.gameId}_${hash(event)}`;

  const start = getStartDateTime(event);
  const startObject: ics.IcsDateObject = {
    date: start,
    type: "DATE-TIME",
  };
  const url = `https://cscsports.leaguelab.com/team/${event.teamId}`;

  const description =
    `${event.teamName} (${event.homeOrVisitor}) vs ${event.opponent}` +
    `${lb}${lb}${event.date} - ${event.time}` +
    `${lb}${lb}${event.location} - ${event.field}` +
    `${lb}${event.locationAddress}` +
    `${lb}${lb}Result: ${event.result ?? "TBD"}` +
    `${lb}${lb}${url}`;

  const result: ics.IcsEvent = {
    summary: `${event.teamName} vs ${event.opponent} @ ${event.location} - ${event.field}`,
    uid: uid,
    stamp: startObject,
    start: startObject,
    duration: { hours: 1 },
    location: event.locationAddress,
    description: description,
    url: url,
    status: "CONFIRMED",
  };
  logger.debug({ event, result }, "mapped LeagueLabEvent to ics.IcsEvent");
  return result;
}

export function getStartDateTime(game: Partial<LeagueLabEvent>): Date {
  const currentYear = new Date().getFullYear();
  // parse "Thursday, July 3 2025 at 7:40 PM" to a DateTime object
  const humanString = `${game.date}, ${currentYear} at ${game.time}`;

  const parsedObject = parser.attempt(humanString);
  const dateTime = DateTime.fromObject(parsedObject, {
    zone: "America/Chicago",
  });

  if (dateTime.isValid) {
    logger.info({ attemptDateTime: dateTime }, "parsed date successfully");
    return new Date(dateTime.toString());
  }

  // default to epoch time if invalid date
  return new Date(0);
}

function getLeagueIdFromGameId(gameId: string): string {
  return gameId.substring(gameId.lastIndexOf("_") + 1);
}

export async function getAddress(event: LeagueLabEvent): Promise<string> {
  // e.g. https://cscsports.leaguelab.com/location/6916

  if (!event.locationId) {
    logger.warn(
      { event },
      "locationId is undefined, returning fallback address",
    );
    return event.location ?? "unknown";
  }
  const resp = await fetch(
    `https://cscsports.leaguelab.com/location/${event.locationId}`,
    {
      cache: "force-cache",
      next: {
        // cache for 12 hours
        revalidate: 12 * 60 * 60,
      },
    },
  );
  const $html = cheerio.load(await resp.text());
  const $addressDiv = $html(`#details_${event.locationId} > div.address`);

  const address = cleanAddress($addressDiv.text().trim());

  const result = address ?? event.location ?? "unknown";
  logger.info({ event, result }, "resultant address");
  return result;
}

export function generateIcalContent(icsEvents: ics.IcsEvent[]): string {
  return ics.generateIcsCalendar({
    prodId: `-//ical-party//leaguelab//tkers//EN`,
    version: "2.0",
    events: icsEvents,
    name: `Thursday Kickers Schedule`,
    nonStandard: {
      // publishedTtl: `PT${revalidate}S`,
    },
  });
}

function cleanAddress(address: string): string {
  // replace newlines and tabs
  address = address.replaceAll("\n", ", ").replaceAll("\t", " ");
  // remove any excessive spaces
  address = address.replace(/\s+/g, " ").trim();
  address = address.replaceAll(" ,", ",");
  return address;
}

function cleanGameResult(result?: string): string {
  if (!result) return "TBD";

  return result.replaceAll("<br>", "\n").replaceAll("&nbsp;", " ").trim();
}

export function hash(data: any): string {
  return objectHash.sha1(data);
}
