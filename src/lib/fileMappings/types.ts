import { ReportProblem } from "../problems";
import { FileMappingProblem } from "../problems/=fileMapping";

export interface BaseFileMapping {
  type: unknown;
  sourcePath: string;
}

export interface FileMappingMaterial<
  FileMapping extends BaseFileMapping = BaseFileMapping,
  CreateOptions = unknown
> {
  caption: string;
  displayTargetPath: (fileMapping: FileMapping) => string;
  createFileMapping: (options: CreateOptions) => FileMapping;
  extractExpectedFilePaths: (
    fileMapping: FileMapping,
  ) => string[] | Promise<string[]>;
  priority: number;
  probe?: (reportProblem: ReportProblem) => Promise<void>;
  process: (fileMapping: FileMapping) => Promise<void>;
}

export interface ProcessingResult {
  completeFileMappings: BaseFileMapping[];
  failedFileMappings: BaseFileMapping[];
  skippedFileMappings: BaseFileMapping[];
  problems: Readonly<FileMappingProblem[]>;
}
