import { readFromJson, writeToJson } from "../../io";
import { getResolvedPathToVideoResource } from "./helpers";
import {
  FrameStripe,
  GetResolvedPath,
  VideoResourceMaterialWithValue,
} from "./types";

export const getResolvedPath: GetResolvedPath = (storage, videoId) =>
  getResolvedPathToVideoResource(storage, videoId, "joinedFrameStripes.json");

export const joinedFrameStripesMaterial: VideoResourceMaterialWithValue<
  FrameStripe[]
> = {
  getResolvedPath,
  get: (storage, videoId) =>
    readFromJson(storage, getResolvedPath(storage, videoId)),
  put: (storage, videoId, value) =>
    writeToJson(storage, getResolvedPath(storage, videoId), value),
};
