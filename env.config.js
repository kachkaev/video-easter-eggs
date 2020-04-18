// @ts-check

const envalid = require("envalid");

module.exports = envalid.cleanEnv(
  process.env,
  {
    ANALYZE: envalid.bool({
      default: false,
      desc: "analyze bundles during app build",
    }),
    VAR_DIR: envalid.str({
      desc: "Path to a directory with variable data (videos and localstack)",
      default: "",
    }),
  },
  { strict: true },
);
