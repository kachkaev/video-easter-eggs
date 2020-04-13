import { readFromYaml, writeToYaml } from "../io";
import { resolvePathToVideoResource } from "./helpers";
import { ExtractedVideoMetadata, VideoResourceMaterial } from "./types";

export const getPath = (videoDir: string) =>
  resolvePathToVideoResource(videoDir, "extractedMetadata.yml");

export const extractedMetadataMaterial: VideoResourceMaterial<ExtractedVideoMetadata> = {
  getPath,
  get: (videoDir) => readFromYaml(getPath(videoDir)),
  set: (videoDir, value) => writeToYaml(getPath(videoDir), value),
};
