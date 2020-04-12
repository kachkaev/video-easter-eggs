import { fileMappingMaterialLookup } from "./materials";
import { BaseFileMapping, FileMappingMaterial } from "./types";

export const dumpFileMapping = ({
  fileMapping,
  styleSourceFilePath = (filePath) => filePath,
  styleTargetFilePath = (filePath) => filePath,
  logCaption,
}: {
  fileMapping: BaseFileMapping;
  styleSourceFilePath?: (filePath: string) => string;
  styleTargetFilePath?: (filePath: string) => string;
  logCaption?: boolean;
}): string => {
  const fileMappingMaterial: FileMappingMaterial | undefined =
    fileMappingMaterialLookup[`${fileMapping.type}`];

  if (!fileMappingMaterial) {
    throw new Error(`Unknown file mapping type ${fileMapping.type}`);
  }

  const lines: string[] = [];
  if (logCaption) {
    lines.push("");
    lines.push(fileMappingMaterial.caption);
  }
  lines.push(`┌ ${styleSourceFilePath(fileMapping.sourcePath)}`);
  lines.push(`└ ${styleTargetFilePath(fileMapping.targetPath)}`);
  return lines.join("\n");
};
