import { NextApiRequest, NextApiResponse } from "next";

import { videoResourceMaterialLookup } from "../../../../lib/resources/videos";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const timeOffset = Number.parseInt(`${req.query.timeOffset}`, 10) || 0;

  try {
    res.setHeader("Content-Type", "image/jpeg");
    res.send(
      videoResourceMaterialLookup.framePreviews.get(videoId, timeOffset),
    );
  } catch {
    res.status(404);
    res.send("Wrong timeOffset provided");
    return;
  }
};
