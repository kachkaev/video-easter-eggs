export interface VideoMetadata {
  duration: number;
}

export interface ProcessedVideoInfo extends VideoMetadata {
  url: string;
  frameStripeHeight: number;
  tailCutoffInterval: number;
}

export type FrameStripes = number[][];

export interface VideoApiData {
  info: ProcessedVideoInfo;
  thumbnailDir: string;
  frameStripes: FrameStripes;
}
