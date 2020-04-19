import React from "react";

import { VideoInfo } from "../../../resources/videos";

export interface TimelineElementData {
  activeTimeOffset?: number;
  frameStripeWidth: number;
  maxLabeledSectionDuration: number;
  onActiveTimeOffsetChange: React.Dispatch<React.SetStateAction<number>>;
  videoInfo: VideoInfo;
  dummyElementCountAtStart: number;
}
