import {
  resolvePathToTimeOffsetDependentVideoResource,
  resolvePathToVideoResource,
} from "./helpers";
import { TimeOffsetDependentVideoResourceMaterial } from "./types";

const getDirPath = (videoDir: string) =>
  resolvePathToVideoResource(videoDir, "framePreviews");

const extension = "jpg";

export const framePreviewsMaterial: TimeOffsetDependentVideoResourceMaterial = {
  extension,
  getDirPath,
  getPath: (videoDir, timeOffset) =>
    resolvePathToTimeOffsetDependentVideoResource(
      getDirPath(videoDir),
      timeOffset,
      extension,
    ),
};
