import { readFromJson, writeToJson } from "../io";
import { resolvePathToVideoResource } from "./helpers";
import { FrameStripe, VideoResourceMaterial } from "./types";

export const getPath = (videoDir: string) =>
  resolvePathToVideoResource(videoDir, "joinedFrameStripes.json");

export const joinedFrameStripesMaterial: VideoResourceMaterial<
  FrameStripe[]
> = {
  getPath,
  get: (videoDir) => readFromJson(getPath(videoDir)),
  set: (videoDir, value) => writeToJson(getPath(videoDir), value),
};
