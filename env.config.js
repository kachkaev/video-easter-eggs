// @ts-check

const envalid = require("envalid");

module.exports = envalid.cleanEnv(
  process.env,
  {
    ANALYZE: envalid.bool({
      default: false,
      desc: "analyze bundles during app build",
    }),
    VIDEO_API_DATA: envalid.str({
      desc: "Path to apiData.json",
    }),
  },
  { strict: true },
);
