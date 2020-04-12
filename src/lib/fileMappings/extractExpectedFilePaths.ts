import { fileMappingMaterialLookup } from "./materials";
import { BaseFileMapping, FileMappingMaterial } from "./types";

export const extractExpectedFilePaths = async (
  fileMappings: BaseFileMapping[],
): Promise<string[]> => {
  const result: string[] = [];
  for (const fileMapping of fileMappings) {
    const fileMappingMaterial: FileMappingMaterial | undefined =
      fileMappingMaterialLookup[`${fileMapping.type}`];

    if (!fileMappingMaterial) {
      throw new Error(`Unknown file mapping type ${fileMapping.type}`);
    }

    result.push(
      ...(await fileMappingMaterial.extractExpectedFilePaths(fileMapping)),
    );
  }
  return result;
};
