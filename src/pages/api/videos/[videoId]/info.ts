import { NextApiRequest, NextApiResponse } from "next";

import { getVideoDir } from "../../../../lib/io/api";
import {
  VideoInfo,
  videoResourceMaterialLookup,
} from "../../../../lib/videoResources";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const videoId = `${req.query.videoId}`;
  const videoDir = getVideoDir(videoId);

  const info: VideoInfo = {
    id: videoId,
    ...(await videoResourceMaterialLookup.config.get(videoDir)),
    ...(await videoResourceMaterialLookup.extractedMetadata.get(videoDir)),
    annotations: [],
  };
  res.json(info);
};
