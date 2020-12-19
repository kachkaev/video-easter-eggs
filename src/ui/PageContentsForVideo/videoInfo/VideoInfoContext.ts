import * as React from "react";

import { VideoInfo } from "../../../shared/resources/videos/types";

export const VideoInfoContext = React.createContext<VideoInfo | undefined>(
  undefined,
);
