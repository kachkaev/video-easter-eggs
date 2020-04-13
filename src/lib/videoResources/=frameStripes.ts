import {
  resolvePathToTimeOffsetDependentVideoResource,
  resolvePathToVideoResource,
} from "./helpers";
import { TimeOffsetDependentVideoResourceMaterial } from "./types";

const getDirPath = (videoDir: string) =>
  resolvePathToVideoResource(videoDir, "frameStripes");

const extension = "json";

export const frameStripesMaterial: TimeOffsetDependentVideoResourceMaterial = {
  extension,
  getDirPath,
  getPath: (videoDir, timeOffset) =>
    resolvePathToTimeOffsetDependentVideoResource(
      getDirPath(videoDir),
      timeOffset,
      extension,
    ),
};
