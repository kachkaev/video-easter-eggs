export interface VideoConfig {
  url: string;
  shortTitle: string;
  frameSamplingInterval: number;
  framePreviewHeight: number;
  frameStripeHeight: number;
  tailCutoffDuration?: number; // cutting the tail to avoid a missing frame
}

export interface VideoSectionCoordinates {
  timeOffset: number;
  timeInterval: number;
}

type LabeledAnnotationType = "easterEgg" | "section";

export interface LabeledAnnotation extends VideoSectionCoordinates {
  type: LabeledAnnotationType;
  label?: string;
}

export interface ExtractedVideoMetadata {
  duration: number;
}

export interface VideoInfo extends VideoConfig, ExtractedVideoMetadata {
  id: string;
  processedDuration: number;
  annotations: LabeledAnnotation[];
}

export type FrameStripe = number[];

export interface SimpleVideoResourceMaterial {
  getPath: (videoDir: string) => string;
}

export interface TimeOffsetDependentVideoResourceMaterial<Value = unknown> {
  extension: string;
  getDirPath: (videoDir: string) => string;
  getPath: (videoDir: string, timeOffset: number) => string;
}

export interface VideoResourceMaterial<Value = unknown> {
  getPath: (videoDir: string) => string;
  get: (videoDir: string) => Promise<Value>;
  set: (videoDir: string, value: Value) => Promise<void>;
}
