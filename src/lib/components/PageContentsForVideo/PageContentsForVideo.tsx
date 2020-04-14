import React from "react";

import { useVideoInfo } from "../../ui/apiHooks";
import VideoVaUi from "./components/VideoVaUi";

const PageContentsForIndex: React.FunctionComponent<{
  videoId: string;
}> = ({ videoId }) => {
  const { data: videoInfo } = useVideoInfo(videoId);

  if (!videoInfo) {
    return null;
  }

  return <VideoVaUi videoInfo={videoInfo} />;
};

export default PageContentsForIndex;
