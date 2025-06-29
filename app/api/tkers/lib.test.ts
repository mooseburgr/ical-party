import { getScheduleEventsForTeamId, tkersTeamIds } from "./lib";

describe("getScheduleForTeamId", () => {
  it("should return a list of games scraped from the website", () => {
    const result = getScheduleEventsForTeamId(tkersTeamIds[0]);
    expect(result).toEqual(["teamA"]);
  });
});
