import { readAllFromYaml, writeAllToYaml } from "../../io";
import { getResolvedPathToVideoResource } from "./helpers";
import {
  GetResolvedPath,
  LabeledAnnotation,
  VideoResourceMaterialWithValue,
} from "./types";

export const getResolvedPath: GetResolvedPath = (storage, videoId) =>
  getResolvedPathToVideoResource(storage, videoId, "labeledSections.yml");

export const labeledSectionsMaterial: VideoResourceMaterialWithValue<
  LabeledAnnotation[]
> = {
  getResolvedPath,
  get: (storage, videoId) =>
    readAllFromYaml(storage, getResolvedPath(storage, videoId)),
  put: (storage, videoId, value) =>
    writeAllToYaml(storage, getResolvedPath(storage, videoId), value),
};
