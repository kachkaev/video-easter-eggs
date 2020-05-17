import React from "react";

import { VideoInfo } from "../../../shared/resources/videos";

const VideoInfoContext = React.createContext<VideoInfo | undefined>(undefined);

export default VideoInfoContext;
