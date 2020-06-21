import { autoStartCommandIfNeeded, Command } from "@kachkaev/commands";
import chalk from "chalk";

import { fileMappingMaterialLookup } from "../shared/fileMappings";
import { initProblems, logProblemsAndMessage } from "../shared/problems";

export const probe: Command = async ({ logger }) => {
  logger.log(chalk.green("Probing project functionality..."));

  const [getProblems, reportProblem] = initProblems();

  for (const fileMappingMaterial of Object.values(fileMappingMaterialLookup)) {
    await fileMappingMaterial.probe?.(reportProblem);
  }

  logProblemsAndMessage(logger, getProblems());
};

autoStartCommandIfNeeded(probe, __filename);
