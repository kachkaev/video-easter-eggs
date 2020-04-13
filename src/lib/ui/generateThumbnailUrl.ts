import { VideoInfo } from "../types";

export const generateThumbnailUrl = (
  videoInfo: VideoInfo,
  timeOffset?: number,
) => {
  return `/api/videoThumbnail?timeOffset=${timeOffset}`;
};
