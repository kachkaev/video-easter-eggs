import { copyMaterial } from "./=copy";
import { downloadVideoMaterial } from "./=downloadVideo";
import { extractVideoMetadataMaterial } from "./=extractVideoMetadata";
import { extractVideoThumbnailsMaterial } from "./=extractVideoThumbnails";
import { linkMaterial } from "./=link";
import { FileMappingMaterial } from "./types";

export const fileMappingMaterialLookup = {
  copy: copyMaterial,
  downloadVideo: downloadVideoMaterial,
  extractVideoMetadata: extractVideoMetadataMaterial,
  extractVideoThumbnails: extractVideoThumbnailsMaterial,
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
