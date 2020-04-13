import fs from "fs-extra";
import { NextApiRequest, NextApiResponse } from "next";

import { getVideoDir } from "../../../../lib/io/api";
import { videoResourceMaterialLookup } from "../../../../lib/videoResources";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const videoId = `${req.query.videoId}`;
  const videoDir = getVideoDir(videoId);
  const timeOffset = Number.parseInt(`${req.query.timeOffset}`, 10) || 0;

  const previewImagePath = videoResourceMaterialLookup.framePreviews.getPath(
    videoDir,
    timeOffset,
  );

  if (!(await fs.pathExists(previewImagePath))) {
    res.status(404);
    res.send("Wrong timeOffset provided");
    return;
  }

  res.setHeader("Content-Type", "image/jpeg");
  res.send(fs.createReadStream(previewImagePath));
};
