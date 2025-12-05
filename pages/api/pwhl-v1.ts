import { parseIcsCalendar } from "@ts-ics/schema-zod";
import type { NextApiRequest, NextApiResponse } from "next";
import { generateIcsCalendar } from "ts-ics";
import { CONTENT_TYPE, logger, TEXT_CAL, USER_AGENT } from "@/app/api/pwhl/lib";

const everyGameId = Array.from({ length: 999 }, (_, i) => i + 1).join(",");
const allGamesIcalUrl = `https://lscluster.hockeytech.com/components/calendar/ical_add_games.php?client_code=pwhl&game_ids=${everyGameId}`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>,
) {
  const teams = Array.isArray(req.query.teams)
    ? req.query.teams
    : (req.query.teams || "").split(",");

  // fetch all games, caching for 3h
  const allGamesResponse = await fetch(allGamesIcalUrl, {
    cache: "force-cache",
    next: {
      revalidate: 60 * 60 * 3,
    },
  });

  if (!allGamesResponse.ok) {
    throw new Error(
      `Failed to fetch games: ${JSON.stringify(allGamesResponse)}`,
    );
  }

  const allGamesCalendar = parseIcsCalendar(await allGamesResponse.text());

  // filter for teams
  const filteredGames = allGamesCalendar.events?.filter((game) => {
    for (const team of teams) {
      if (game.summary.includes(team || "")) {
        return true;
      }
    }
    return false;
  });

  logger.info(
    `filtered w '${teams}' down to ${filteredGames?.length} out of ${allGamesCalendar.events?.length} total PWHL games from user-agent '${req.headers[USER_AGENT]}'`,
  );
  const filteredGamesCalendar = {
    prodId: allGamesCalendar.prodId.trimEnd(),
    version: allGamesCalendar.version,
    events: filteredGames,
    name: "PWHL Games",
  };
  const outputIcsCalendar = generateIcsCalendar(filteredGamesCalendar);

  res.status(200).setHeader(CONTENT_TYPE, TEXT_CAL).send(outputIcsCalendar);
}
