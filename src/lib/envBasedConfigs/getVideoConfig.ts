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

export const getApiConfig = _.memoize(() => {
  const env = envalid.cleanEnv(
    process.env,
    {
      VIDEO_URL: envalid.str({
        desc: "URL of the video to process",
      }),
      VIDEO_LABEL: nonEmptyStringValidator({
        desc: "Local identifier of the downloaded video",
      }),
    },
    { reporter: customReporter, strict: true },
  );
  return {
    ...env,
  };
});
