import _ from "lodash";

export const configureExitOnUnhandledRejection = _.once(() => {
  process.on("unhandledRejection", (unhandledPromise) => {
    // eslint-disable-next-line no-console
    console.log(unhandledPromise);
    process.exit(1);
  });
});
