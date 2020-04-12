import fs from "fs-extra";
import { NextApiRequest, NextApiResponse } from "next";
import getConfig from "next/config";
import path from "path";

import { getRelativeBasePathForTimeOffset } from "../../lib/io/getRelativeBasePathForTimeOffset";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const timeOffset = Number.parseInt(`${req.query.timeOffset}`, 10) || -1;
  const { apiVideoDir } = getConfig().serverRuntimeConfig;
  const imagePath = path.resolve(
    apiVideoDir,
    "thumbnails",
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
