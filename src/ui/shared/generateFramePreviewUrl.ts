import { getResolvedPathToTimeOffsetDependentVideoResource } from "../../shared/resources/videos/helpers";
import { VideoInfo } from "../../shared/resources/videos/types";

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
