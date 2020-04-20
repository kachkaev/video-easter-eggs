import { VideoInfo } from "../../../../resources/videos";

export interface TabProps {
  active: boolean;
  activeTimeOffset: number;
  onActiveTimeOffsetChange: React.Dispatch<React.SetStateAction<number>>;
  videoInfo: VideoInfo;
}
