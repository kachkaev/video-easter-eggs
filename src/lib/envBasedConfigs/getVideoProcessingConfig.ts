import envalid from "envalid";
import _ from "lodash";
import path from "path";

import { customReporter } from "./customReporter";
import { getCommonConfig } from "./getCommonConfig";

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
      VIDEO_ID: nonEmptyStringValidator({
        desc: "Local identifier of a video to work with",
      }),
    },
    { reporter: customReporter, strict: true },
  );

  const videosDir = path.resolve(getCommonConfig().varDir, "videos");

  return {
    ...env,
    videosDir,
  };
});
