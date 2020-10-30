import envalid from "envalid";
import _ from "lodash";

import { customReporter } from "./customReporter";

const concurrencyValidator = envalid.makeValidator<number>((input) => {
  const coerced = +input;
  if (
    Number.isNaN(coerced) ||
    `${coerced}` !== `${input}` ||
    coerced % 1 !== 0 ||
    coerced < 1 ||
    coerced > 16
  ) {
    throw new TypeError(`Invalid concurrency: "${input}"`);
  }

  return coerced;
});

export const getCommonConfig = _.memoize(() => {
  const env = envalid.cleanEnv(
    process.env,
    {
      /* eslint-disable @typescript-eslint/naming-convention */

      NODE_ENV: envalid.str({ default: "development" }),
      QUEUE_CONCURRENCY: concurrencyValidator({ default: 8 }),
      RESET: envalid.bool({ default: false }),
      VAR_DIR: envalid.str({
        default: "var",
      }),
      /* eslint-enable @typescript-eslint/naming-convention */
    },
    { reporter: customReporter, strict: true },
  );

  return {
    ...env,
  };
});
