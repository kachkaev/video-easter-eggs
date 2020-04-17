import { ResourceStorageType } from "../../resourceStorages";

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

export type LabeledAnnotationType = "easterEgg" | "section";

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

export interface VideoResourceMaterial {
  getRelativePath: (videoId: string) => string;
}

export interface TimeOffsetDependentVideoResourceMaterial<Value = unknown> {
  extension: string;
  getRelativeDirPath: (videoId: string) => string;
  getRelativePath: (videoId: string, timeOffset: number) => string;
}

export interface VideoResourceMaterialWithValue<Value = unknown>
  extends VideoResourceMaterial {
  get: (storage: ResourceStorageType, videoId: string) => Promise<Value>;
  put: (
    storage: ResourceStorageType,
    videoDir: string,
    value: Value,
  ) => Promise<void>;
}
