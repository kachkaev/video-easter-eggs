import { readFromBinary } from "../../io";
import {
  getResolvedPathToTimeOffsetDependentVideoResource,
  getResolvedPathToVideoResource,
} from "./helpers";
import {
  GetResolvedDirPath,
  GetTimeOffsetDependentResolvedPath,
  TimeOffsetDependentVideoResourceMaterial,
} from "./types";

const extension = "jpg";

const getResolvedDirPath: GetResolvedDirPath = (storage, videoId) =>
  getResolvedPathToVideoResource(storage, videoId, "framePreviews");

const getResolvedPath: GetTimeOffsetDependentResolvedPath = (
  storage,
  videoId,
  timeOffset,
) =>
  getResolvedPathToTimeOffsetDependentVideoResource(
    getResolvedDirPath(storage, videoId),
    timeOffset,
    extension,
  );

export const framePreviewsMaterial: TimeOffsetDependentVideoResourceMaterial = {
  extension,
  getResolvedDirPath,
  getResolvedPath,
  get: (storage, videoId, timeOffset) =>
    readFromBinary(storage, getResolvedPath(storage, videoId, timeOffset)),
};
