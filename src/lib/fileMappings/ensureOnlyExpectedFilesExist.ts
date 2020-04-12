import fs from "fs-extra";
import globby from "globby";
import _ from "lodash";
import PQueue from "p-queue";

import { getCommonConfig } from "../envBasedConfigs";

export const ensureOnlyExpectedFilesExist = async (
  directoryPaths: string[],
  expectedFilePaths: string[],
  logger: Console,
) => {
  const foundFilePathsInWeb = await globby(directoryPaths);

  const unconfirmedFilePathsInWeb = _.difference(
    expectedFilePaths,
    foundFilePathsInWeb,
  );
  if (unconfirmedFilePathsInWeb.length) {
    throw new Error(
      `Expected the following files, but they were not found:\n${unconfirmedFilePathsInWeb.join(
        "\n",
      )}`,
    );
  }

  const unexpectedFilePaths = _.difference(
    foundFilePathsInWeb,
    expectedFilePaths,
  );

  const queue = new PQueue({
    concurrency: getCommonConfig().QUEUE_CONCURRENCY,
  });
  for (const unexpectedFilePath of unexpectedFilePaths) {
    queue.add(async () => {
      await fs.remove(unexpectedFilePath);
    });
  }
  await queue.onIdle();
  logger.log(
    `Number of files deleted after checking the result: ${unexpectedFilePaths.length}.`,
  );
};
