import { NextApiRequest, NextApiResponse } from "next";

import { getApiResourceStorage } from "../../../../lib/io/api";
import { videoResourceMaterialLookup } from "../../../../lib/resources/videos";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const videoId = `${req.query.videoId}`;
  const timeOffset = Number.parseInt(`${req.query.timeOffset}`, 10) || 0;

  try {
    res.setHeader("Content-Type", "image/jpeg");
    res.send(
      await videoResourceMaterialLookup.framePreviews.get(
        getApiResourceStorage(),
        videoId,
        timeOffset,
      ),
    );
  } catch {
    res.status(404);
    res.send("Wrong timeOffset provided");
    return;
  }
};
