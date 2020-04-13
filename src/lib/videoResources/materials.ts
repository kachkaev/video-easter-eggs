import { configMaterial } from "./=config";
import { downloadMaterial } from "./=download";
import { extractedMetadataMaterial } from "./=extractedMetadata";
import { framePreviewsMaterial } from "./=framePreviews";
import { frameStripesMaterial } from "./=frameStripes";
import { joinedFrameStripesMaterial } from "./=joinedFrameStripes";
import { labeledEasterEggsMaterial } from "./=labeledEasterEggs";
import { labeledSectionsMaterial } from "./=labeledSections";

export const videoResourceMaterialLookup = {
  config: configMaterial,
  download: downloadMaterial,
  extractedMetadata: extractedMetadataMaterial,
  framePreviews: framePreviewsMaterial,
  frameStripes: frameStripesMaterial,
  joinedFrameStripes: joinedFrameStripesMaterial,
  labeledEasterEggs: labeledEasterEggsMaterial,
  labeledSections: labeledSectionsMaterial,
};
