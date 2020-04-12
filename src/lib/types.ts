import { VideoMetadata } from "./fileMappings/=extractVideoMetadata";

export interface VideoApiData {
  url: string;
  metadata: VideoMetadata;
  frameStripeHeight: number;
  tailCutoffInterval: number;
  frameStripes: number[][];
}
