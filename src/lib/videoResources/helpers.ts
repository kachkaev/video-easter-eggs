import { Duration } from "luxon";
import path from "path";

export const resolvePathToVideoResource = (
  videoDir: string,
  relativePath: string,
) => path.resolve(videoDir, relativePath);

export const resolvePathToTimeOffsetDependentVideoResource = (
  containerDir: string,
  timeOffset: number,
  extension: string,
) => {
  const timeOffsetAsDuration = Duration.fromMillis(timeOffset);
  return path.resolve(
    containerDir,
    timeOffsetAsDuration.toFormat("hh-xx-xx"),
    timeOffsetAsDuration.toFormat("hh-mm-xx"),
    `${timeOffsetAsDuration.toFormat("hh-mm-ss.SSS")}.${extension}`,
  );
};
