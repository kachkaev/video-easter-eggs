import { VideoInfo } from "../resources/videos/types";

export const generateFramePreviewUrl = (
  videoInfo: VideoInfo,
  timeOffset?: number,
) => {
  return `/api/videos/${videoInfo.id}/framePreview?timeOffset=${timeOffset}`;
};
