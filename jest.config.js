module.exports = {
  testEnvironment: "node",
  testMatch: ["**/app/api/pwhl/**/*.test.ts"],
  transform: {
    "^.+\\.tsx?$": ["@swc/jest"],
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
};
