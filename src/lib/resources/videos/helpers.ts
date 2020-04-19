import { Duration } from "luxon";
import path from "path";

import { ResourceStorageMaterial } from "../../resourceStorages";
import { ExtractedVideoMetadata, VideoConfig } from "./types";

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
  resolvedDirPath: string,
  timeOffset: number,
  extension: string,
) => {
  const timeOffsetAsDuration = Duration.fromMillis(timeOffset);
  return path.join(
    resolvedDirPath,
    timeOffsetAsDuration.toFormat("hh-xx-xx"),
    timeOffsetAsDuration.toFormat("hh-mm-xx"),
    `${timeOffsetAsDuration.toFormat("hh-mm-ss.SSS")}.${extension}`,
  );
};

export const calculateProcessedTimeDuration = (
  config: VideoConfig,
  extractedMetadata: ExtractedVideoMetadata,
): number =>
  (Math.floor(
    (extractedMetadata.duration - (config.tailCutoffDuration || 0)) /
      config.frameSamplingInterval,
  ) +
    1) *
  config.frameSamplingInterval;
