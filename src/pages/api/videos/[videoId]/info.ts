import { NextApiRequest, NextApiResponse } from "next";

import { getApiResourceStorage } from "../../../../lib/io/api";
import {
  VideoInfo,
  videoResourceMaterialLookup,
} from "../../../../lib/resources/videos";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const videoId = `${req.query.videoId}`;

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
  res.json(info);
};
