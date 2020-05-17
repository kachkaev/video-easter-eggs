import {
  getResolvedPathToTimeOffsetDependentVideoResource,
  VideoInfo,
} from "../../shared/resources/videos";

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
