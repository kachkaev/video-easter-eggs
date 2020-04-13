import { resolvePathToVideoResource } from "./helpers";
import { SimpleVideoResourceMaterial } from "./types";

export const downloadMaterial: SimpleVideoResourceMaterial = {
  getPath: (videoDir: string) =>
    resolvePathToVideoResource(videoDir, "download.mp4"),
};
