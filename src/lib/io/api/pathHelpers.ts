import getConfig from "next/config";
import path from "path";

export const getVideosDir = () => getConfig().serverRuntimeConfig.videosPath;

export const getVideoDir = (videoId: string) =>
  path.resolve(getConfig().serverRuntimeConfig.videosPath, videoId);
