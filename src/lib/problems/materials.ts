import { fileMappingProblemMaterial } from "./=fileMapping";
import { missingProgramProblemMaterial } from "./=missingProgram";
import { ProblemMaterial } from "./types";

export const problemMaterialLookup = {
  fileMapping: fileMappingProblemMaterial,
  missingProgram: missingProgramProblemMaterial,
};

export const getProblemMaterial = (problemType: unknown): ProblemMaterial => {
  const problemMaterial: ProblemMaterial | undefined =
    problemMaterialLookup[`${problemType}`];

  if (!problemMaterial) {
    throw new Error(`Unknown problem type ${problemType}`);
  }

  return problemMaterial;
};
