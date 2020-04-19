import { ResourceStorageMaterial } from "../../resourceStorages";

export interface VideoConfig {
  url: string;
  urlOfCommentWithTimestamps?: string;
  shortTitle: string;
  frameSamplingInterval: number;
  framePreviewHeight: number;
  frameStripeHeight: number;
  tailCutoffDuration?: number; // cutting the tail to avoid a missing frame

  sectionLabeling?: {
    minExpectedSectionDuration: number;
    frameStripeDifferenceTolerance: number;
    referenceFrameTimeOffset: number;
    referenceFrameTimeOffsetWithinSection: number;
  };
}

export interface VideoSectionCoordinates {
  timeOffset: number;
  timeDuration: number;
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
  publicResourcesBaseUrl: string;
  labeledSections: LabeledAnnotation[];
  labeledEasterEggs: LabeledAnnotation[];
}

export type FrameStripe = string[];

export type GetResolvedPath = (
  storage: ResourceStorageMaterial,
  videoId: string,
) => string;

export type GetResolvedDirPath = GetResolvedPath;

export type GetTimeOffsetDependentResolvedPath = (
  storage: ResourceStorageMaterial,
  videoId: string,
  timeOffset: number,
) => string;

export interface VideoResourceMaterial {
  getResolvedPath: GetResolvedPath;
}

export interface TimeOffsetDependentVideoResourceMaterial<Value = unknown> {
  extension: string;
  getResolvedDirPath: GetResolvedDirPath;
  getResolvedPath: GetTimeOffsetDependentResolvedPath;
  get: (
    storage: ResourceStorageMaterial,
    videoId: string,
    timeOffset: number,
  ) => Promise<Value>;
}

export interface VideoResourceMaterialWithValue<Value = unknown>
  extends VideoResourceMaterial {
  get: (storage: ResourceStorageMaterial, videoId: string) => Promise<Value>;
  put: (
    storage: ResourceStorageMaterial,
    videoDir: string,
    value: Value,
  ) => Promise<void>;
}
