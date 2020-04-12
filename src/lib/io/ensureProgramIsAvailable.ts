import commandExists from "command-exists";

import { problemMaterialLookup, ReportProblem } from "../problems";
import { CreateMissingProgramProblemOptions } from "../problems/=missingProgram";

export const ensureProgramIsAvailable = async (
  commandName: string,
  reportProblem: ReportProblem,
  problemOptions: Omit<CreateMissingProgramProblemOptions, "commandName">,
) => {
  try {
    await commandExists(commandName);
  } catch {
    reportProblem(
      problemMaterialLookup.missingProgram.createProblem({
        commandName,
        ...problemOptions,
      }),
    );
  }
};
