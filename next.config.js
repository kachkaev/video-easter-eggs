// @ts-check

const env = require("./env.config.js");

const productionConfig = {
  serverRuntimeConfig: {
    apiVideoDir: env.API_VIDEO_DIR,
  },
};

module.exports = (phase, rest) =>
  phase === require("next/constants").PHASE_PRODUCTION_SERVER
    ? productionConfig
    : require("next-compose-plugins")(
        [
          [require("next-fonts")],
          require("@next/bundle-analyzer")({
            enabled: env.ANALYZE,
          }),
          require("@zeit/next-source-maps")(),
        ],
        {
          ...productionConfig,
          reactStrictMode: true,
          typescript: {
            ignoreDevErrors: true,
            ignoreBuildErrors: true,
          },
        },
      )(phase, rest);
