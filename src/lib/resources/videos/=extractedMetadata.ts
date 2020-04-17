import { readFromYaml, writeToYaml } from "../../io";
import { resolveRelativePathToVideoResource } from "./helpers";
import {
  ExtractedVideoMetadata,
  VideoResourceMaterialWithValue,
} from "./types";

export const getRelativePath = (videoId: string) =>
  resolveRelativePathToVideoResource(videoId, "extractedMetadata.yml");

export const extractedMetadataMaterial: VideoResourceMaterialWithValue<ExtractedVideoMetadata> = {
  getRelativePath,
  get: (storage, videoId) => readFromYaml(storage, getRelativePath(videoId)),
  put: (storage, videoId, value) =>
    writeToYaml(storage, getRelativePath(videoId), value),
};
