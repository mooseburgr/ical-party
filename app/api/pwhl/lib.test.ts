import type { NextRequest } from "next/server";
import {
  buildIcsEvents,
  fetchAllGames,
  filterGamesByTeam,
  getStartDateTime,
  getTeamsFromRequest,
} from "./lib";

describe("getTeamsFromRequest", () => {
  it("should return a single team from the request", () => {
    const mockRequest = {
      nextUrl: {
        searchParams: new URLSearchParams("teams=teamA"),
      },
    } as unknown as NextRequest;

    const result = getTeamsFromRequest(mockRequest);
    expect(result).toEqual(["teamA"]);
  });

  it("should return multiple teams sorted alphabetically", () => {
    const mockRequest = {
      nextUrl: {
        searchParams: new URLSearchParams("teams=teamB,teamA,teamC"),
      },
    } as unknown as NextRequest;

    const result = getTeamsFromRequest(mockRequest);
    expect(result).toEqual(["teamA", "teamB", "teamC"]);
  });

  it("should return an empty array if no teams are provided", () => {
    const mockRequest = {
      nextUrl: {
        searchParams: new URLSearchParams(""),
      },
    } as unknown as NextRequest;

    const result = getTeamsFromRequest(mockRequest);
    expect(result).toEqual([]);
  });

  it("should handle duplicate team names and return unique sorted teams", () => {
    const mockRequest = {
      nextUrl: {
        searchParams: new URLSearchParams("teams=Minnesota,Montr,Minnesota"),
      },
    } as unknown as NextRequest;

    const result = getTeamsFromRequest(mockRequest);
    expect(result).toEqual(["Minnesota", "Montr"]);
  });

  it("should handle case-insensitive sorting of team names", () => {
    const mockRequest = {
      nextUrl: {
        searchParams: new URLSearchParams("teams=teamB,TeamA,teamC"),
      },
    } as unknown as NextRequest;

    const result = getTeamsFromRequest(mockRequest);
    expect(result).toEqual(["TeamA", "teamB", "teamC"]);
  });
});

describe("fetchAllGames", () => {
  it("should handle errors when fetching games", async () => {
    // Mock the fetch function to throw an error
    global.fetch = jest.fn(() =>
      Promise.reject(new Error("Network error")),
    ) as jest.Mock;

    const result = await fetchAllGames();
    expect(result).toEqual([]);
  });
});

describe("filterGamesByTeam", () => {
  it("should filter games by a single team", async () => {
    const allGames = await fetchAllGames();
    const filteredGames = filterGamesByTeam(allGames, ["Minnesota"]);

    expect(filteredGames).toBeInstanceOf(Array);
    expect(filteredGames.length).toBeGreaterThan(50);
  });

  it("should return an empty array if no games match the team", async () => {
    const allGames = await fetchAllGames();
    const filteredGames = filterGamesByTeam(allGames, ["NonExistentTeam"]);

    expect(filteredGames).toEqual([]);
  });
});

describe("fetchAllGames > filterGamesByTeam > buildIcsEvents", () => {
  it("should fetch all games, filter by team, and return events", async () => {
    const allGames = await fetchAllGames();
    const filteredGames = filterGamesByTeam(allGames, ["Minnesota"]);
    const result = buildIcsEvents(filteredGames);

    expect(result).toBeInstanceOf(Array);
    expect(result.length).toBeGreaterThan(50);
  });
});

describe("getStartDateTime", () => {
  it("should return the start date-time when ISO 8601 available", () => {
    const game = {
      GameDateISO8601: "2024-10-01T19:00:00Z",
    };
    const result = getStartDateTime(game);
    expect(result).toEqual(new Date("2024-10-01T19:00:00Z"));
  });

  it("should handle TBD start times as 8am Central", () => {
    const game = {
      GameDateISO8601: "",
      game_status: "TBD",
      date_played: "2024-10-01",
    };
    const result = getStartDateTime(game);
    const expectedDate = new Date("2024-10-01T13:00:00Z"); // 8am Central is 1pm UTC
  });

  it("should handle empty game data", () => {
    const game = {};
    const result = getStartDateTime({});
    expect(result).toEqual(new Date(0));
  });
});
