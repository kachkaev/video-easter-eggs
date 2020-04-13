import { readFromYaml, writeToYaml } from "../io";
import { resolvePathToVideoResource } from "./helpers";
import { VideoConfig, VideoResourceMaterial } from "./types";

export const getPath = (videoDir: string) =>
  resolvePathToVideoResource(videoDir, "config.yml");

export const configMaterial: VideoResourceMaterial<VideoConfig> = {
  getPath,
  get: (videoDir) => readFromYaml(getPath(videoDir)),
  set: (videoDir, value) => writeToYaml(getPath(videoDir), value),
};
