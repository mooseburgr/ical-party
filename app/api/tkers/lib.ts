import * as cheerio from "cheerio";
import { minify } from "html-minifier-terser";
import pino from "pino";
import { revalidate } from "@/app/api/tkers/route";
import type { LeagueLabEvent } from "@/app/api/tkers/types";

const logger = pino();

export const teamIds = [875437, 879554];

export async function getScheduleForTeamId(
  teamId: number,
): Promise<LeagueLabEvent[]> {
  const resp = await fetch(`https://cscsports.leaguelab.com/team/${teamId}`, {
    cache: "force-cache",
    next: {
      revalidate: revalidate,
    },
  });
  const schedulePage = await minify(await resp.text(), {
    collapseWhitespace: true,
  });
  const $html = cheerio.load(schedulePage);

  const scheduleTable = $html("#teamScheduleTable > tbody");

  const splitEvents: LeagueLabEvent[] = [];
  scheduleTable.children().each((i, el) => {
    const $tr = $html(el);

    const event: LeagueLabEvent = {
      teamId,
      date: $tr.find("td.gameDate h4").text().trim(),

      id: $tr.attr("id"),
      time: $tr.find("td.gameTime").text().trim(),
      location: $tr.find("td.gameLocation a").text().trim(),
      field: $tr.find("td.gameLocation").contents().last().text().trim(),
      opponent: $tr.find("td.opponent a").text().trim(),
      homeOrVisitor: $tr.find("div.homeOrVisitor").text().trim(),
      result: $tr.find("td.result").html()?.trim(),
    };

    logger.debug(`${i}: ${$tr} - mapped to: ${JSON.stringify(event)}`);
    splitEvents.push(event);
  });

  const joinedEvents: LeagueLabEvent[] = [];
  let wipEvent: LeagueLabEvent = { teamId };
  splitEvents.forEach((event) => {
    if (!event.id) {
      // if no game ID, assume date row, indicating start of new event
      wipEvent = event;
    } else {
      // spread the second row's data into the WIP event, keeping date
      wipEvent = {
        ...event,
        date: wipEvent.date,
      };

      joinedEvents.push(wipEvent);
    }
  });

  return joinedEvents;
}
