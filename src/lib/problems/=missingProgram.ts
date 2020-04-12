import { BaseProblem, ProblemMaterial, ProblemSeverity } from "./types";

export interface MissingProgramProblem extends BaseProblem {
  type: "missingProgram";
  commandName: string;
  commandPurposes?: string[];
}

export interface CreateMissingProgramProblemOptions {
  commandName: string;
  commandPurposes?: string | string[];
  severity?: ProblemSeverity;
}

const createMissingProgramProblem = ({
  commandName,
  commandPurposes,
  severity = "error",
}: CreateMissingProgramProblemOptions): MissingProgramProblem => ({
  type: "missingProgram",
  commandName,
  commandPurposes: commandPurposes ? [commandPurposes].flat() : undefined,
  severity,
});

const dumpMissingProgramProblem = (problem: MissingProgramProblem) => {
  const lines: string[] = [];
  lines.push(
    `${problem.severity === "error" ? "❌" : "⚠️"} Program "${
      problem.commandName
    }" not found${
      problem.commandPurposes ? ` (${problem.commandPurposes.join(", ")})` : ""
    }`,
  );
  return lines.join("\n");
};

const extractMissingProgramProblemDumpSequence = (
  problem: MissingProgramProblem,
) => `aaaa ${problem.commandName}`;

export const missingProgramProblemMaterial: ProblemMaterial<
  MissingProgramProblem,
  CreateMissingProgramProblemOptions
> = {
  createProblem: createMissingProgramProblem,
  dump: dumpMissingProgramProblem,
  extractDumpSequence: extractMissingProgramProblemDumpSequence,
};
