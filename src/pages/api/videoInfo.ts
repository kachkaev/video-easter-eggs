import { NextApiRequest, NextApiResponse } from "next";

import { getVideoApiData } from "../../lib/api";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  res.json((await getVideoApiData()).info);
};
