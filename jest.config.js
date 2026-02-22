const { loadEnvConfig } = require("@next/env");
const nextJest = require("next/jest");

loadEnvConfig(process.cwd(), true);

const createJestConfig = nextJest({ dir: "." });

const customJestConfig = {
  moduleDirectories: ["node_modules", "<rootDir>"],
  testEnvironment: "node",
};

module.exports = createJestConfig(customJestConfig);
