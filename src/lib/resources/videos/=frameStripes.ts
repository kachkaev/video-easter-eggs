import { readFromJson } from "../../io";
import {
  getResolvedPathToTimeOffsetDependentVideoResource,
  getResolvedPathToVideoResource,
} from "./helpers";
import {
  FrameStripe,
  GetResolvedDirPath,
  GetTimeOffsetDependentResolvedPath,
  TimeOffsetDependentVideoResourceMaterial,
} from "./types";

const extension = "json";

const getResolvedDirPath: GetResolvedDirPath = (storage, videoId) =>
  getResolvedPathToVideoResource(storage, videoId, "frameStripes");

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

export const frameStripesMaterial: TimeOffsetDependentVideoResourceMaterial<FrameStripe> = {
  extension,
  getResolvedDirPath,
  getResolvedPath,
  get: (storage, videoId, timeOffset) =>
    readFromJson(storage, getResolvedPath(storage, videoId, timeOffset)),
};
