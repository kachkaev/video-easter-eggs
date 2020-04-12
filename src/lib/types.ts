export interface VideoMetadata {
  duration: number;
}

export interface VideoInfo extends VideoMetadata {
  url: string;
  frameStripeHeight: number;
  thumbnailInterval: number;
  processedDuration: number;
}

export type FrameStripes = number[][];

export interface VideoApiData {
  info: VideoInfo;
  thumbnailDir: string;
  frameStripes: FrameStripes;
}
