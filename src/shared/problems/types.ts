export type ProblemSeverity = "error" | "warning";

export interface BaseProblem {
  type: string;
  severity: ProblemSeverity;
  [extraParam: string]: unknown;
}

export type ReportProblem<Problem = BaseProblem> = (problem: Problem) => void;

export interface ProblemMaterial<
  Problem extends BaseProblem = BaseProblem,
  CreateOptions = unknown
> {
  createProblem: (options: CreateOptions) => Problem;
  dump: (problem: Problem, previousProblem?: BaseProblem) => string;
  extractDumpSequence: (problem: Problem) => string;
}
