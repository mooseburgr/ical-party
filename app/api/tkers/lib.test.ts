import type { NextRequest } from "next/server";
import { getScheduleForTeamId, teamIds } from "./lib";

describe("getScheduleForTeamId", () => {
  it("should return a list of games scraped from the website", () => {
    const result = getScheduleForTeamId(teamIds[0]);
    expect(result).toEqual(["teamA"]);
  });
});
