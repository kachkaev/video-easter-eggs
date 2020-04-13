import { readAllFromYaml, writeAllToYaml } from "../io";
import { resolvePathToVideoResource } from "./helpers";
import { LabeledAnnotation, VideoResourceMaterial } from "./types";

export const getPath = (videoDir: string) =>
  resolvePathToVideoResource(videoDir, "labeledEasterEggs.yml");

export const labeledEasterEggsMaterial: VideoResourceMaterial<
  LabeledAnnotation[]
> = {
  getPath,
  get: (videoDir) => readAllFromYaml(getPath(videoDir)),
  set: (videoDir, value) => writeAllToYaml(getPath(videoDir), value),
};
