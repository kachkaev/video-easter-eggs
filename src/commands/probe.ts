import chalk from "chalk";

import { autoStartCommandIfNeeded, Command } from "../shared/commands";
import { fileMappingMaterialLookup } from "../shared/fileMappings";
import { initProblems, logProblemsAndMessage } from "../shared/problems";

const command: Command = async (context) => {
  const { logger } = context;
  logger.log(chalk.green("Probing project functionality..."));

  const [getProblems, reportProblem] = initProblems();

  for (const fileMappingMaterial of Object.values(fileMappingMaterialLookup)) {
    await fileMappingMaterial.probe?.(reportProblem);
  }

  logProblemsAndMessage(logger, getProblems());
};

autoStartCommandIfNeeded(command, __filename);

export default command;
