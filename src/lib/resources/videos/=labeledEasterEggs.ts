import { readAllFromYaml, writeAllToYaml } from "../../io";
import { resolveRelativePathToVideoResource } from "./helpers";
import { LabeledAnnotation, VideoResourceMaterialWithValue } from "./types";

export const getRelativePath = (videoId: string) =>
  resolveRelativePathToVideoResource(videoId, "labeledEasterEggs.yml");

export const labeledEasterEggsMaterial: VideoResourceMaterialWithValue<
  LabeledAnnotation[]
> = {
  getRelativePath,
  get: (storage, videoId) => readAllFromYaml(storage, getRelativePath(videoId)),
  put: (storage, videoId, value) =>
    writeAllToYaml(storage, getRelativePath(videoId), value),
};
