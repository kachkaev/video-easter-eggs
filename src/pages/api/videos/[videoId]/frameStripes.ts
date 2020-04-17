import { NextApiRequest, NextApiResponse } from "next";

import { getResourceStorageType } from "../../../../lib/io/api";
import { videoResourceMaterialLookup } from "../../../../lib/resources/videos";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const videoId = `${req.query.videoId}`;
  const firstFrameOffset =
    Number.parseInt(`${req.query.firstFrameOffset}`, 10) || 0;
  const frameCount = Number.parseInt(`${req.query.frameCount}`, 10) || -1;

  const selectedFrameStripes = (
    await videoResourceMaterialLookup.joinedFrameStripes.get(
      getResourceStorageType(),
      videoId,
    )
  ).slice(firstFrameOffset, firstFrameOffset + frameCount);
  res.json(selectedFrameStripes);
};
