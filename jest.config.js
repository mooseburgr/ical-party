module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/app/api/pwhl/**/*.test.ts"],
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.json",
    },
  },
};
