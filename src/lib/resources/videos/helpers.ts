import { Duration } from "luxon";
import path from "path";

import { ResourceStorageMaterial } from "../../resourceStorages";

export const resolveRelativePathToResource = (
  storage: ResourceStorageMaterial,
  ...paths: string[]
) => storage.resolvePath(path.join(...paths));

export const getResolvedPathToVideoResource = (
  storage: ResourceStorageMaterial,
  videoId: string,
  relativePath: string,
) => resolveRelativePathToResource(storage, "videos", videoId, relativePath);

export const getResolvedPathToTimeOffsetDependentVideoResource = (
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
