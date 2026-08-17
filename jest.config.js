module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/app/**/*.test.ts"],
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.json",
    },
  },
};
