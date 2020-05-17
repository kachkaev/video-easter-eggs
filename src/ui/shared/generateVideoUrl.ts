import { VideoInfo } from "../../shared/resources/videos/types";

export const generateVideoUrl = (videoInfo: VideoInfo, timeOffset?: number) => {
  let result = videoInfo.urlOfCommentWithTimeCodes || videoInfo.url;
  if (typeof timeOffset === "number") {
    result += `&t=${Math.floor(timeOffset / 1000)}`;
  }
  return result;
};
