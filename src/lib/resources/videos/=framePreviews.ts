import {
  resolvePathToTimeOffsetDependentVideoResource,
  resolveRelativePathToVideoResource,
} from "./helpers";
import { TimeOffsetDependentVideoResourceMaterial } from "./types";

const getRelativeDirPath = (videoId: string) =>
  resolveRelativePathToVideoResource(videoId, "framePreviews");

const extension = "jpg";

export const framePreviewsMaterial: TimeOffsetDependentVideoResourceMaterial = {
  extension,
  getRelativeDirPath,
  getRelativePath: (videoId, timeOffset) =>
    resolvePathToTimeOffsetDependentVideoResource(
      getRelativeDirPath(videoId),
      timeOffset,
      extension,
    ),
};
