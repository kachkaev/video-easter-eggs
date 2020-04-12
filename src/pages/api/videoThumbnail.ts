import fs from "fs-extra";
import { NextApiRequest, NextApiResponse } from "next";
import path from "path";

import { getVideoApiData } from "../../lib/api";
import { getRelativeBasePathForTimeOffset } from "../../lib/io/getRelativeBasePathForTimeOffset";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const timeOffset = Number.parseInt(`${req.query.timeOffset}`, 10) || 0;
  const imagePath = path.resolve(
    (await getVideoApiData()).thumbnailDir,
    `${getRelativeBasePathForTimeOffset(timeOffset)}.jpg`,
  );

  if (!(await fs.pathExists(imagePath))) {
    res.status(404);
    res.send("Wrong timeOffset provided");
    return;
  }

  res.setHeader("Content-Type", "image/jpeg");
  res.send(fs.createReadStream(imagePath));
};
