import { useQuery } from "react-query";

import { VideoInfo } from "../../videoResources/types";

const getVideoInfo = async (_, videoId: string) => {
  return await (await fetch(`/api/videos/${videoId}/info`)).json();
};

export const useVideoInfo = (videoId: string) => {
  return useQuery<VideoInfo, [string, string]>(
    ["videoInfo", videoId],
    getVideoInfo,
  );
};
