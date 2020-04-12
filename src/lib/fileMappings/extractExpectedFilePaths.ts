import { getFileMappingMaterial } from "./materials";
import { BaseFileMapping } from "./types";

export const extractExpectedFilePaths = async (
  fileMappings: BaseFileMapping[],
): Promise<string[]> => {
  const result: string[] = [];
  for (const fileMapping of fileMappings) {
    result.push(
      ...(await getFileMappingMaterial(
        fileMapping.type,
      ).extractExpectedFilePaths(fileMapping)),
    );
  }
  return result;
};
