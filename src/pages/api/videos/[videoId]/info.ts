import { NextApiRequest, NextApiResponse } from "next";

import { getResourceStorageType } from "../../../../lib/io/api";
import {
  VideoInfo,
  videoResourceMaterialLookup,
} from "../../../../lib/resources/videos";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const videoId = `${req.query.videoId}`;

  const config = await videoResourceMaterialLookup.config.get(
    getResourceStorageType(),
    videoId,
  );
  const extractedMetadata = await videoResourceMaterialLookup.extractedMetadata.get(
    getResourceStorageType(),
    videoId,
  );

  const info: VideoInfo = {
    id: videoId,
    processedDuration:
      extractedMetadata.duration - (config.tailCutoffDuration || 0),
    ...config,
    ...extractedMetadata,
    annotations: [],
  };
  res.json(info);
};
