import type { NextApiRequest, NextApiResponse } from "next";
import * as ics from "ts-ics";
import pino from "pino";
import { Game, HockeyTechResponse } from "@/pages/api/types";
import { VCalendar, VEvent } from "ts-ics";

const logger = pino();

const scheduleUrl =
  "https://lscluster.hockeytech.com/feed/?feed=modulekit&view=schedule&fmt=json&lang=en" +
  `&key=446521baf8c38984&client_code=pwhl&season_id=`;

// "all" season IDs (1 through 10)
const allSeasonIds = Array.from({ length: 10 }, (_, i) => i + 1);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>,
) {
  let teams: string[] = [];
  if (req.query.teams) {
    teams = Array.isArray(req.query.teams)
      ? req.query.teams
      : req.query.teams.split(",");
  }
  teams.sort((a, b) => a.localeCompare(b));
  console.log(teams.length);

  const allGames = await fetchAllGames();

  const filteredGames = filterGamesByTeam(allGames, teams);

  const icsEvents: VEvent[] = buildVEvents(filteredGames);

  logger.info(
    `filtered w '%s' down to %s out of %s total PWHL games from user-agent '%s'`,
    teams,
    filteredGames?.length,
    allGames?.length,
    req.headers["user-agent"],
  );

  const teamsDisplay = teams.length > 0 ? teams : "all";
  const filteredGamesCalendar = {
    prodId: `-//ical-party//pwhl//${teamsDisplay}//EN`,
    events: icsEvents,
    name: `PWHL Games [${teamsDisplay}]`,
  } as VCalendar;
  const outputIcsCalendar = ics.generateIcsCalendar(filteredGamesCalendar);

  res
    .status(200)
    // .setHeader("Content-Type", "text/calendar")
    .send(outputIcsCalendar);
}

async function fetchAllGames() {
  const allGames: Game[] = [];
  // iterate over "all" seasons and add each's list of games to a single list
  const seasonPromises = allSeasonIds.map(async (seasonId) => {
    try {
      const seasonResp = await fetch(scheduleUrl + seasonId);
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
function filterGamesByTeam(allGames: Game[], teams: string[]) {
  if (teams.length == 0) {
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
function buildVEvents(games: Game[]): ics.VEvent[] {
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

    let description = `Game Center: https://www.thepwhl.com/en/stats/game-center/${g.game_id}
Venue: ${g.venue_name} - ${g.venue_url}
Tickets: ${g.tickets_url}
Broadcasts: ${broadcasters}
YouTube: https://www.youtube.com/@thepwhlofficial`;

    if (start < now) {
      // include scores and links to reports if game start is in the past
      summary = `${g.visiting_team_name} (${g.visiting_goal_count}) @ ${g.home_team_name} (${g.home_goal_count})`;
      description += `
Status: ${g.game_status}
Game Summary: https://www.thepwhl.com/en/stats/game-summary/${g.game_id}
Game Sheet: https://lscluster.hockeytech.com/game_reports/official-game-report.php?client_code=pwhl&game_id=${g.game_id}&lang_id=1
Game Report: https://lscluster.hockeytech.com/game_reports/text-game-report.php?client_code=pwhl&game_id=${g.game_id}&lang_id=1
`;
    }

    const event: ics.VEvent = {
      summary: summary,
      uid: `${g.client_code}-${g.season_id}-${g.game_id}@hockeytech.com`,
      stamp: startObject,
      start: startObject,
      duration: { hours: 3 },
      location: `${g.venue_name}, ${g.venue_location}`,
      description: description,
      url: g.mobile_calendar,
      status: "CONFIRMED",
    };
    logger.debug({ g, event }, "built VEvent from game");
    return event;
  });
}
