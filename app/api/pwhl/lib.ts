import type { Game, HockeyTechResponse } from "@/app/api/pwhl/types";
import type { NextRequest } from "next/server";
import pino from "pino";
import * as ics from "ts-ics";

const logger = pino();

export const CONTENT_TYPE = "content-type";
export const USER_AGENT = "user-agent";
export const TEXT_CAL = "text/calendar";

export const FIVE_MINS_SEC = 60 * 5;
export const THREE_HOURS_SEC = 60 * 60 * 3;

const scheduleUrl =
  "https://lscluster.hockeytech.com/feed/?feed=modulekit&view=schedule&fmt=json&lang=en" +
  "&key=446521baf8c38984&client_code=pwhl&season_id=";

// "all" season IDs (1 through 10)
const allSeasonIds = Array.from({ length: 10 }, (_, i) => i + 1);

export function getTeamsFromRequest(req: NextRequest): string[] {
  const teams = req.nextUrl.searchParams.getAll("teams");
  teams.sort((a, b) => a.localeCompare(b));
  return teams;
}

export async function getCurrentSeasonId(): Promise<number> {
  let id = 0;
  try {
    const seasonResp = await fetch(scheduleUrl, {
      cache: "force-cache",
      next: {
        revalidate: THREE_HOURS_SEC,
      },
    });
    const seasonData: HockeyTechResponse = await seasonResp.json();
    id = +seasonData.SiteKit.Parameters.season_id;
  } catch (error) {
    logger.error({ error }, "Failed to fetch current season ID");
  }
  logger.debug("determined current season ID as: %s", id);
  return id;
}

export async function fetchAllGames(): Promise<Game[]> {
  const allGames: Game[] = [];
  const currentSeasonId = await getCurrentSeasonId();
  // iterate over "all" seasons and add each's list of games to a single list
  const seasonPromises = allSeasonIds.map(async (seasonId) => {
    try {
      const seasonResp = await fetch(scheduleUrl + seasonId, {
        cache: "force-cache",
        next: {
          // only cache response for 5 min if current season
          revalidate:
            seasonId === currentSeasonId ? FIVE_MINS_SEC : THREE_HOURS_SEC,
        },
      });
      const seasonData: HockeyTechResponse = await seasonResp.json();
      return seasonData.SiteKit.Schedule || [];
    } catch (error) {
      logger.error({ error, seasonId }, "Failed to fetch season schedule");
      return [];
    }
  });

  const seasonResults = await Promise.all(seasonPromises);
  allGames.push(...seasonResults.flat());

  return allGames;
}

// filter games by selected teams if specified
export function filterGamesByTeam(allGames: Game[], teams: string[]): Game[] {
  if (teams.length === 0) {
    return allGames;
  }
  return allGames.filter((game) => {
    for (const team of teams) {
      if (
        game.home_team_name.includes(team) ||
        game.visiting_team_name.includes(team)
      ) {
        return true;
      }
    }
    return false;
  });
}

// map games to VEvents
export function buildVEvents(games: Game[]): ics.VEvent[] {
  const now = new Date();
  return games.map((g) => {
    // parse ISO8601 format string into Date
    const start = new Date(g.GameDateISO8601);
    const startObject: ics.DateObject = {
      date: start,
      type: "DATE-TIME",
    };

    let summary = `${g.visiting_team_name} @ ${g.home_team_name}`;

    const broadcasters = [
      ...(g.broadcasters.home_video?.map((b) => b.name) ?? []),
      ...(g.broadcasters.visiting_video?.map((b) => b.name) ?? []),
      ...(g.broadcasters.home_video_fr?.map((b) => b.name) ?? []),
    ].join(", ");

    const lb = "<br/>";
    let description =
      `Game Center: https://www.thepwhl.com/en/stats/game-center/${g.game_id}` +
      `${lb}Venue: <a href="${g.venue_url}">${g.venue_name}</a>` +
      `${lb}Tickets: ${g.tickets_url}` +
      `${lb}Broadcasts: ${broadcasters}` +
      `${lb}YouTube: https://www.youtube.com/@thepwhlofficial`;

    if (start < now) {
      // include scores and links to reports if game start is in the past
      summary = `${g.visiting_team_name} (${g.visiting_goal_count}) @ ${g.home_team_name} (${g.home_goal_count})`;
      description +=
        `${lb}${lb}Status: ${g.game_status}` +
        `${lb}Game Summary: https://www.thepwhl.com/en/stats/game-summary/${g.game_id}` +
        `${lb}Game Sheet: https://lscluster.hockeytech.com/game_reports/official-game-report.php?client_code=pwhl&game_id=${g.game_id}` +
        `${lb}Game Report: https://lscluster.hockeytech.com/game_reports/text-game-report.php?client_code=pwhl&game_id=${g.game_id}`;
    }

    const event: ics.VEvent = {
      summary: summary,
      uid: `${g.client_code}-s${g.season_id}-g${g.game_id}@hockeytech.com`,
      stamp: startObject,
      start: startObject,
      duration: { hours: 3 },
      location: `${g.venue_name}, ${g.venue_location}`,
      description: description,
      comment: "test comment plz ignore",
      url: g.mobile_calendar,
      status: "CONFIRMED",
    };
    logger.debug({ g, event }, "built VEvent from game");
    return event;
  });
}

export function generateIcalContent(
  teams: string[],
  icsEvents: ics.VEvent[],
): string {
  const teamsDisplay = teams.length > 0 ? teams : "all";
  const outputIcsCalendar = ics.generateIcsCalendar({
    prodId: `-//ical-party//pwhl//${teamsDisplay}//EN`,
    version: "2.0",
    events: icsEvents,
    name: `PWHL Games [${teamsDisplay}]`,
  });
  return outputIcsCalendar;
}
