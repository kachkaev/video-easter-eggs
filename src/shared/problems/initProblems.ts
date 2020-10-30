import { BaseProblem, ReportProblem } from "./types";

export const initProblems = <Problem = BaseProblem>(): [
  () => Readonly<Problem[]>,
  ReportProblem<Problem>,
] => {
  const problems: Problem[] = [];
  const getProblems = () => [...problems];
  const reportProblem: ReportProblem<Problem> = (problem) => {
    problems.push(problem);
  };

  return [getProblems, reportProblem];
};
