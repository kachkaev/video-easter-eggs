// @ts-check

const envalid = require("envalid");

module.exports = envalid.cleanEnv(
  process.env,
  {
    /* eslint-disable @typescript-eslint/naming-convention */

    ANALYZE: envalid.bool({
      default: false,
      desc: "analyze bundles during app build",
    }),
    API_RESOURCE_STORAGE_TYPE: envalid.str({
      choices: ["local", "s3"],
    }),
    /* eslint-enable @typescript-eslint/naming-convention */
  },
  { strict: true },
);
