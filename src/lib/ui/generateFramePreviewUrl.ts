import { VideoInfo } from "../videoResources/types";

export const generateFramePreviewUrl = (
  videoInfo: VideoInfo,
  timeOffset?: number,
) => {
  return `/api/videos/${videoInfo.id}/framePreview?timeOffset=${timeOffset}`;
};
