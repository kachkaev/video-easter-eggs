import { copyMaterial } from "./=copy";
import { downloadVideoMaterial } from "./=downloadVideo";
import { extractVideoFramePreviewsMaterial } from "./=extractVideoFramePreviews";
import { extractVideoFrameStripeMaterial } from "./=extractVideoFrameStripe";
import { extractVideoMetadataMaterial } from "./=extractVideoMetadata";
import { linkMaterial } from "./=link";
import { FileMappingMaterial } from "./types";

export const fileMappingMaterialLookup = {
  copy: copyMaterial,
  downloadVideo: downloadVideoMaterial,
  extractVideoFrameStripe: extractVideoFrameStripeMaterial,
  extractVideoMetadata: extractVideoMetadataMaterial,
  extractVideoFramePreview: extractVideoFramePreviewsMaterial,
  link: linkMaterial,
};

export const getFileMappingMaterial = (
  fileMappingType: unknown,
): FileMappingMaterial => {
  const fileMappingMaterial: FileMappingMaterial | undefined =
    fileMappingMaterialLookup[`${fileMappingType}`];

  if (!fileMappingMaterial) {
    throw new Error(`Unknown file mapping type ${fileMappingType}`);
  }
  return fileMappingMaterial;
};
