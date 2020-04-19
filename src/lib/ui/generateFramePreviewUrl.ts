import { getResolvedPathToTimeOffsetDependentVideoResource } from "../resources/videos/helpers";
import { VideoInfo } from "../resources/videos/types";

export const generateFramePreviewUrl = (
  videoInfo: VideoInfo,
  timeOffset: number,
) => {
  return `${videoInfo.publicResourcesBaseUrl}/videos/${
    videoInfo.id
  }/${getResolvedPathToTimeOffsetDependentVideoResource(
    "framePreviews",
    timeOffset,
    "jpg",
  )}`;
};
