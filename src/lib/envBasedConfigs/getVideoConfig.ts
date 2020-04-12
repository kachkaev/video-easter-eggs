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

export const getVideoConfig = _.memoize(() => {
  const env = envalid.cleanEnv(
    process.env,
    {
      FRAME_STRIPE_HEIGHT: envalid.num({
        default: 10,
      }),
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
      VIDEO_THUMBNAIL_INTERVAL: envalid.num({
        default: 1000,
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
  const downloadMetadataFilePath = path.resolve(
    videoDir,
    `downloadMetadata.json`,
  );

  const thumbnailDir = path.resolve(videoDir, "thumbnails");

  const frameStipesDir = path.resolve(
    videoDir,
    `frameStipes_${env.FRAME_STRIPE_HEIGHT}`,
  );
  const combinedFrameStripesFilePath = path.resolve(
    frameStipesDir,
    "combined.json",
  );

  const apiDataFilePath = path.resolve(videoDir, "apiData.json");

  return {
    ...env,
    downloadFilePath,
    downloadMetadataFilePath,
    videoDir,
    thumbnailDir,
    frameStipesDir,
    combinedFrameStripesFilePath,
    tailCutoffInterval: 1000, // cutting the tail to avoid a missing frame
    apiDataFilePath,
  };
});
