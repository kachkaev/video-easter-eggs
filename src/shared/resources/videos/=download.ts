import { getResolvedPathToVideoResource } from "./helpers";
import { VideoResourceMaterial } from "./types";

export const downloadMaterial: VideoResourceMaterial = {
  getResolvedPath: (storage, videoDir) =>
    getResolvedPathToVideoResource(storage, videoDir, "download.mp4"),
};
