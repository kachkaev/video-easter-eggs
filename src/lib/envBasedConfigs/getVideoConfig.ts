import envalid from "envalid";
import _ from "lodash";
import { Duration } from "luxon";
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

export const getVideoConfig = _.memoize(() => {
  const env = envalid.cleanEnv(
    process.env,
    {
      VIDEO_URL: envalid.str({
        desc: "URL of the video to process",
      }),
      VIDEO_ID: nonEmptyStringValidator({
        desc: "Local identifier of the downloaded video",
      }),
      VIDEO_HEIGHT: envalid.num({
        default: 144,
        choices: [144, 240],
      }),
    },
    { reporter: customReporter, strict: true },
  );

  const videoDir = path.resolve(
    getCommonConfig().varDir,
    "videos",
    `${env.VIDEO_ID}_${env.VIDEO_HEIGHT}`,
  );
  const downloadFilePath = path.resolve(videoDir, `download.mp4`);

  const thumbnailDir = path.resolve(videoDir, "thumbnails");
  const getThumbnailFilePath = (timeOffset: number) => {
    const timeOffsetAsDuration = Duration.fromMillis(timeOffset);
    path.resolve(
      thumbnailDir,
      timeOffsetAsDuration.toFormat("hh-xx-xx"),
      `${timeOffsetAsDuration.toFormat("hh-mm-ss-SSS")}.jpg`,
    );
  };

  return {
    ...env,
    downloadFilePath,
    videoDir,
    getThumbnailFilePath,
  };
});
