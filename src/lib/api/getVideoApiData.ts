import fs from "fs-extra";
import getConfig from "next/config";

import { VideoApiData } from "../types";

let videoApiData: VideoApiData;

export const getVideoApiData = async (): Promise<VideoApiData> => {
  if (!videoApiData) {
    const { videoApiDataFilePath } = getConfig().serverRuntimeConfig;
    videoApiData = await fs.readJson(videoApiDataFilePath);
  }
  return videoApiData;
};
