import React from "react";

import { VideoInfo } from "../../../shared/resources/videos/types";
import VideoInfoContext from "./VideoInfoContext";

export const useVideoInfo = (): VideoInfo => {
  const result = React.useContext(VideoInfoContext);
  if (result === undefined) {
    throw new Error("No VideoInfoContext value available");
  }
  return result;
};
