import { NextApiRequest, NextApiResponse } from "next";

import { getVideoDir } from "../../../../lib/io/api";
import {
  VideoInfo,
  videoResourceMaterialLookup,
} from "../../../../lib/videoResources";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const videoId = `${req.query.videoId}`;
  const videoDir = getVideoDir(videoId);

  const config = await videoResourceMaterialLookup.config.get(videoDir);
  const extractedMetadata = await videoResourceMaterialLookup.extractedMetadata.get(
    videoDir,
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
