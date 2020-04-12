import { NextApiRequest, NextApiResponse } from "next";

import { getVideoApiData } from "../../lib/api";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const start = Number.parseInt(`${req.query.start}`, 10) || 0;
  const count = Number.parseInt(`${req.query.count}`, 10) || -1;
  const selectedFrameStripes = (await getVideoApiData()).frameStripes.slice(
    start,
    count - start,
  );
  res.json(selectedFrameStripes);
};
