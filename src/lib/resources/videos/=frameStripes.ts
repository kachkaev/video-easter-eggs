import {
  resolvePathToTimeOffsetDependentVideoResource,
  resolveRelativePathToVideoResource,
} from "./helpers";
import { TimeOffsetDependentVideoResourceMaterial } from "./types";

const getRelativeDirPath = (videoId: string) =>
  resolveRelativePathToVideoResource(videoId, "frameStripes");

const extension = "json";

export const frameStripesMaterial: TimeOffsetDependentVideoResourceMaterial = {
  extension,
  getRelativeDirPath,
  getRelativePath: (videoId, timeOffset) =>
    resolvePathToTimeOffsetDependentVideoResource(
      getRelativeDirPath(videoId),
      timeOffset,
      extension,
    ),
};
