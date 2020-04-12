// @ts-check

const envalid = require("envalid");

module.exports = envalid.cleanEnv(
  process.env,
  {
    ANALYZE: envalid.bool({
      default: false,
      desc: "analyze bundles during app build",
    }),
    API_VIDEO_DIR: envalid.str({
      desc: "Directory with apiData.json and thumbnails",
      default: require("path").resolve(__dirname, `var/videos/lalahey_144`),
    }),
  },
  { strict: true },
);
