import getConfig from "next/config";
import path from "path";

export const getVideosDir = () => getConfig().serverRuntimeConfig.videosDir;

export const getVideoDir = (videoId: string) =>
  path.resolve(getVideosDir(), videoId);
