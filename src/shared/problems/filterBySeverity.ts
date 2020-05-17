import { BaseProblem, ProblemSeverity } from "./types";

export const filterProblemsBySeverity = (
  problems: Readonly<BaseProblem[]>,
  severity: ProblemSeverity,
) => problems.filter((problem) => problem.severity === severity);
