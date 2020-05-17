import { VideoInfo, videoResourceMaterialLookup } from "../../resources/videos";
import { calculateProcessedTimeDuration } from "../../resources/videos/helpers";
import { getApiResourceStorage } from "./getApiResourceStorage";

export const getVideoInfo = async (videoId: string): Promise<VideoInfo> => {
  const resourceStorage = getApiResourceStorage();
  const [
    config,
    extractedMetadata,
    labeledSections,
    labeledEasterEggs,
  ] = await Promise.all([
    await videoResourceMaterialLookup.config.get(resourceStorage, videoId),
    await videoResourceMaterialLookup.extractedMetadata.get(
      resourceStorage,
      videoId,
    ),
    await videoResourceMaterialLookup.labeledSections.get(
      resourceStorage,
      videoId,
    ),
    await videoResourceMaterialLookup.labeledEasterEggs.get(
      resourceStorage,
      videoId,
    ),
  ]);

  const publicResourcesBaseUrl =
    resourceStorage.getPublicResourcesBaseUrl() || "/api";

  const info: VideoInfo = {
    id: videoId,
    processedTimeDuration: calculateProcessedTimeDuration(
      config,
      extractedMetadata,
    ),
    ...config,
    ...extractedMetadata,
    publicResourcesBaseUrl,
    labeledSections,
    labeledEasterEggs,
  };
  return info;
};
