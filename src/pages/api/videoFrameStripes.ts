import { NextApiRequest, NextApiResponse } from "next";

import { getVideoApiData } from "../../lib/api";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const firstFrameOffset =
    Number.parseInt(`${req.query.firstFrameOffset}`, 10) || 0;
  const frameCount = Number.parseInt(`${req.query.frameCount}`, 10) || -1;
  const selectedFrameStripes = (await getVideoApiData()).frameStripes.slice(
    firstFrameOffset,
    firstFrameOffset + frameCount,
  );
  res.json(selectedFrameStripes);
};
