import fs from "fs-extra";

import { extractExpectedFilePaths } from "./extractExpectedFilePaths";
import { BaseFileMapping } from "./types";

const firstFileIsNotNewer = async (
  fileA: string,
  fileB: string,
): Promise<boolean> => {
  try {
    const [statA, statB] = await Promise.all([fs.stat(fileA), fs.stat(fileB)]);
    if (statA.mtime <= statB.mtime) {
      return true;
    }
  } catch (e) {
    //
  }
  return false;
};

export const detectIfCanBeSkipped = async (
  fileMapping: BaseFileMapping,
): Promise<boolean> => {
  const expectedFilePaths = await extractExpectedFilePaths([fileMapping]);

  const expectedFilePathsCanBeSkipped = await Promise.all(
    expectedFilePaths.map((expectedFilePath) =>
      firstFileIsNotNewer(fileMapping.sourcePath, expectedFilePath),
    ),
  );

  return (
    expectedFilePathsCanBeSkipped.find((value) => value === false) === undefined
  );
};
