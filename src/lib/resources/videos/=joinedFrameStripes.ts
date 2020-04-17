import { readFromJson, writeToJson } from "../../io";
import { resolveRelativePathToVideoResource } from "./helpers";
import { FrameStripe, VideoResourceMaterialWithValue } from "./types";

export const getRelativePath = (videoId: string) =>
  resolveRelativePathToVideoResource(videoId, "joinedFrameStripes.json");

export const joinedFrameStripesMaterial: VideoResourceMaterialWithValue<
  FrameStripe[]
> = {
  getRelativePath,
  get: (storage, videoId) => readFromJson(storage, getRelativePath(videoId)),
  put: (storage, videoId, value) =>
    writeToJson(storage, getRelativePath(videoId), value),
};
