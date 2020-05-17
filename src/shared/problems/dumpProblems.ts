import _ from "lodash";

import { getProblemMaterial } from "./materials";
import { BaseProblem } from "./types";

export const dumpProblems = (problems: Readonly<BaseProblem[]>): string => {
  const orderedProblems = _.orderBy(problems, (problem) =>
    getProblemMaterial(problem.type).extractDumpSequence(problem),
  );

  let prevProblem: BaseProblem | undefined = undefined;

  return orderedProblems
    .map((problem) => {
      const extract = getProblemMaterial(problem.type).dump(
        problem,
        prevProblem,
      );
      prevProblem = problem;
      return extract;
    })
    .join("\n");
};
