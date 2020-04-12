import _ from "lodash";

import { problemMaterialLookup } from "./materials";
import { BaseProblem, ProblemMaterial } from "./types";

export const dumpProblems = (problems: Readonly<BaseProblem[]>): string => {
  const orderedProblems = _.orderBy(problems, (problem) => {
    const problemMaterial: ProblemMaterial | undefined =
      problemMaterialLookup[`${problem.type}`];
    if (!problemMaterial) {
      throw new Error(`Unknown problem type ${problem.type}`);
    }
    return problemMaterial.extractDumpSequence(problem);
  });

  let prevProblem: BaseProblem | undefined = undefined;

  return orderedProblems
    .map((problem) => {
      const problemMaterial: ProblemMaterial =
        problemMaterialLookup[`${problem.type}`];
      const extract = problemMaterial.dump(problem, prevProblem);
      prevProblem = problem;
      return extract;
    })
    .join("\n");
};
