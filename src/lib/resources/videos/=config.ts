import { readFromYaml, writeToYaml } from "../../io";
import { resolveRelativePathToVideoResource } from "./helpers";
import { VideoConfig, VideoResourceMaterialWithValue } from "./types";

export const getRelativePath = (videoId: string) =>
  resolveRelativePathToVideoResource(videoId, "config.yml");

export const configMaterial: VideoResourceMaterialWithValue<VideoConfig> = {
  getRelativePath,
  get: (storage, videoId) => readFromYaml(storage, getRelativePath(videoId)),
  put: (storage, videoId, value) =>
    writeToYaml(storage, getRelativePath(videoId), value),
};
