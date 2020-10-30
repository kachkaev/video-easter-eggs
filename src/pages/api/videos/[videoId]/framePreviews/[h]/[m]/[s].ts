import { NextApiRequest, NextApiResponse } from "next";
import path from "path";

import { getApiResourceStorage } from "../../../../../../../shared/io/api";
import { getResolvedPathToVideoResource } from "../../../../../../../shared/resources/videos/helpers";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const videoId = `${req.query.videoId}`;
  const h = `${req.query.h}`;
  const m = `${req.query.m}`;
  const s = `${req.query.s}`;

  try {
    res.setHeader("Content-Type", "image/jpeg");
    const resourceStorage = getApiResourceStorage();
    const resolvedResourcePath = getResolvedPathToVideoResource(
      resourceStorage,
      videoId,
      path.join("framePreviews", h, m, s),
    );
    res.send(await resourceStorage.getResource(resolvedResourcePath));
  } catch {
    res.status(404);
    res.send("Wrong time coordinate provided");

    return;
  }
};
