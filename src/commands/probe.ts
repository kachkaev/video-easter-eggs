import chalk from "chalk";

import { autoStartCommandIfNeeded, Command } from "../lib/commands";
import { logProblemsAndMessage } from "../lib/commands/logProblemsAndMessage";
import { fileMappingMaterialLookup } from "../lib/fileMappings";
import { initProblems } from "../lib/problems";

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
