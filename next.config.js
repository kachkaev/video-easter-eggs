// @ts-check

const env = require("./env.config.js");

const productionConfig = {
  serverRuntimeConfig: {
    apiResourceStorageType: env.API_RESOURCE_STORAGE_TYPE,
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
          redirects: () => [
            {
              source: "/",
              destination: "/lalahey",
              permanent: false,
            },
          ],
          reactStrictMode: true,
          typescript: {
            ignoreDevErrors: true,
            ignoreBuildErrors: true,
          },
        },
      )(phase, rest);
