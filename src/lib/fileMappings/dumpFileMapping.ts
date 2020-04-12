import { getFileMappingMaterial } from "./materials";
import { BaseFileMapping } from "./types";

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
  const lines: string[] = [];
  if (logCaption) {
    lines.push("");
    lines.push(getFileMappingMaterial(fileMapping.type).caption);
  }
  lines.push(`┌ ${styleSourceFilePath(fileMapping.sourcePath)}`);
  lines.push(`└ ${styleTargetFilePath(fileMapping.targetPath)}`);
  return lines.join("\n");
};
