import fs from "fs-extra";
import { NextApiRequest, NextApiResponse } from "next";
import getConfig from "next/config";
import path from "path";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { apiVideoDir } = getConfig().serverRuntimeConfig;
  res.json(await fs.readJson(path.resolve(apiVideoDir, "apiData.json")));
};
