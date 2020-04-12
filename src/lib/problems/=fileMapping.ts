import chalk from "chalk";

import { BaseFileMapping, dumpFileMapping } from "../fileMappings";
import { BaseProblem, ProblemMaterial } from "./types";

export interface FileMappingProblem extends BaseProblem {
  type: "fileMapping";
  fileMapping: BaseFileMapping;
  error: any;
}

interface CreateResourceProblemOptions {
  fileMapping: BaseFileMapping;
  error: any;
}

const createFileMappingProblem = ({
  fileMapping,
  error,
}: CreateResourceProblemOptions): FileMappingProblem => ({
  type: "fileMapping",
  fileMapping,
  error,
  severity: "error",
});

const dumpFileMappingProblem = (problem: FileMappingProblem) =>
  `${dumpFileMapping({
    fileMapping: problem.fileMapping,
    styleTargetFilePath: chalk.red,
  })}\n❌  ${
    problem.error instanceof Error ? problem.error.message : problem.error
  }`;

const extractFileMappingProblemDumpSequence = (problem: FileMappingProblem) =>
  JSON.stringify(problem); // TODO: implement

export const fileMappingProblemMaterial: ProblemMaterial<
  FileMappingProblem,
  CreateResourceProblemOptions
> = {
  createProblem: createFileMappingProblem,
  dump: dumpFileMappingProblem,
  extractDumpSequence: extractFileMappingProblemDumpSequence,
};
