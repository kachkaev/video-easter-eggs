import { VideoInfo } from "../../../resources/videos";

export interface TimelineListElementData {
  frameStripeWidth: number;
  maxLabeledSectionDuration: number;
  videoInfo: VideoInfo;
  dummyElementCountAtStart: number;
  sectionToDiffIndex: number;
}
