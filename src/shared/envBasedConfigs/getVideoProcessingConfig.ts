import envalid from "envalid";
import _ from "lodash";

import { customReporter } from "./customReporter";

export const nonEmptyStringValidator = envalid.makeValidator<string>(
  (input) => {
    if (typeof input !== "string" || !input.length) {
      throw new TypeError(`Invalid non-empty string provided`);
    }

    return input;
  },
);

export const getVideoProcessingConfig = _.memoize(() => {
  const env = envalid.cleanEnv(
    process.env,
    {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      VIDEO_ID: nonEmptyStringValidator({
        desc: "Local identifier of a video to work with",
      }),
    },
    { reporter: customReporter, strict: true },
  );

  return {
    ...env,
  };
});
