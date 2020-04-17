import { resolveRelativePathToVideoResource } from "./helpers";
import { VideoResourceMaterial } from "./types";

export const downloadMaterial: VideoResourceMaterial = {
  getRelativePath: (videoDir: string) =>
    resolveRelativePathToVideoResource(videoDir, "download.mp4"),
};
