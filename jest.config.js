module.exports = {
  collectCoverageFrom: ["src/**/*.{ts,tsx,js}"],
  moduleFileExtensions: ["ts", "tsx", "js", "yml"],
  testEnvironment: "node",
  testMatch: ["**/src/**/*.(spec|test).(j|t)s?(x)"],
  testPathIgnorePatterns: ["/node_modules/"],
};
