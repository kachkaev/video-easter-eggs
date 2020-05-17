import { readFromYaml, writeToYaml } from "../../io";
import { getResolvedPathToVideoResource } from "./helpers";
import {
  GetResolvedPath,
  VideoConfig,
  VideoResourceMaterialWithValue,
} from "./types";

export const getResolvedPath: GetResolvedPath = (storage, videoId) =>
  getResolvedPathToVideoResource(storage, videoId, "config.yml");

export const configMaterial: VideoResourceMaterialWithValue<VideoConfig> = {
  getResolvedPath,
  get: (storage, videoId) =>
    readFromYaml(storage, getResolvedPath(storage, videoId)),
  put: (storage, videoId, value) =>
    writeToYaml(storage, getResolvedPath(storage, videoId), value),
};
