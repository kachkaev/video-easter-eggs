import { useQuery } from "react-query";

import { FrameStripe, VideoInfo } from "../../videoResources/types";

const getFrameStripes = async (
  _,
  videoId: string,
  timeOffsetStart: number,
  timeOffsetInterval: number,
  frameSamplingInterval: number,
) => {
  const firstFrameOffset = Math.floor(timeOffsetStart / frameSamplingInterval);
  const frameCount = Math.floor(timeOffsetInterval / frameSamplingInterval);
  return await (
    await fetch(
      `/api/videos/${videoId}/frameStripes?firstFrameOffset=${firstFrameOffset}&frameCount=${frameCount}`,
    )
  ).json();
};

export const useFrameStripes = (
  videoInfo: VideoInfo,
  timeOffsetStart: number,
  timeOffsetInterval: number,
) => {
  const result = useQuery<
    FrameStripe[],
    [string, string, number, number, number]
  >(
    [
      "frameStripes",
      videoInfo.id,
      timeOffsetStart,
      timeOffsetInterval,
      videoInfo.frameSamplingInterval,
    ],
    getFrameStripes,
  );

  return result.data || [];
};
