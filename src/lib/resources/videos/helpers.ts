import { Duration } from "luxon";
import path from "path";

export const resolveRelativePathToResource = (...paths: string[]) =>
  path.join(...paths);

export const resolveRelativePathToVideoResource = (
  videoId: string,
  relativePath: string,
) => resolveRelativePathToResource("videos", videoId, relativePath);

export const resolvePathToTimeOffsetDependentVideoResource = (
  relativeDirPath: string,
  timeOffset: number,
  extension: string,
) => {
  const timeOffsetAsDuration = Duration.fromMillis(timeOffset);
  return path.resolve(
    relativeDirPath,
    timeOffsetAsDuration.toFormat("hh-xx-xx"),
    timeOffsetAsDuration.toFormat("hh-mm-xx"),
    `${timeOffsetAsDuration.toFormat("hh-mm-ss.SSS")}.${extension}`,
  );
};
