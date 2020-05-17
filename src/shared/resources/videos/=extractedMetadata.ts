import { readFromYaml, writeToYaml } from "../../io";
import { getResolvedPathToVideoResource } from "./helpers";
import {
  ExtractedVideoMetadata,
  GetResolvedPath,
  VideoResourceMaterialWithValue,
} from "./types";

export const getResolvedPath: GetResolvedPath = (storage, videoId) =>
  getResolvedPathToVideoResource(storage, videoId, "extractedMetadata.yml");

export const extractedMetadataMaterial: VideoResourceMaterialWithValue<ExtractedVideoMetadata> = {
  getResolvedPath,
  get: (storage, videoId) =>
    readFromYaml(storage, getResolvedPath(storage, videoId)),
  put: (storage, videoId, value) =>
    writeToYaml(storage, getResolvedPath(storage, videoId), value),
};
