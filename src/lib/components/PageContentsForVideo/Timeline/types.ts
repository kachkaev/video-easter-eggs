import React from "react";

import { VideoInfo } from "../../../resources/videos";

export interface TimelineListElementData {
  activeTimeOffset?: number;
  frameStripeWidth: number;
  maxLabeledSectionDuration: number;
  onActiveTimeOffsetChange: React.Dispatch<React.SetStateAction<number>>;
  videoInfo: VideoInfo;
  dummyElementCountAtStart: number;
  sectionToDiffIndex: number;
}
