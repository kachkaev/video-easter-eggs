import { VideoInfo, videoResourceMaterialLookup } from "../../resources/videos";
import { getApiResourceStorage } from "./getApiResourceStorage";

export const getVideoInfo = async (videoId: string): Promise<VideoInfo> => {
  const config = await videoResourceMaterialLookup.config.get(
    getApiResourceStorage(),
    videoId,
  );
  const extractedMetadata = await videoResourceMaterialLookup.extractedMetadata.get(
    getApiResourceStorage(),
    videoId,
  );
  const labeledSections = await videoResourceMaterialLookup.labeledSections.get(
    getApiResourceStorage(),
    videoId,
  );
  const labeledEasterEggs = await videoResourceMaterialLookup.labeledEasterEggs.get(
    getApiResourceStorage(),
    videoId,
  );

  const info: VideoInfo = {
    id: videoId,
    processedDuration:
      extractedMetadata.duration - (config.tailCutoffDuration || 0),
    ...config,
    ...extractedMetadata,
    labeledSections,
    labeledEasterEggs,
  };
  return info;
};
