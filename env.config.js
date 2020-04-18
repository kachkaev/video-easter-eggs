// @ts-check

const envalid = require("envalid");

module.exports = envalid.cleanEnv(
  process.env,
  {
    ANALYZE: envalid.bool({
      default: false,
      desc: "analyze bundles during app build",
    }),
    API_RESOURCE_STORAGE_TYPE: envalid.str({
      choices: ["local", "s3"],
    }),
  },
  { strict: true },
);
