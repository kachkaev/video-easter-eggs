import chalk from "chalk";

import { configureExitOnUnhandledRejection } from "./configureExitOnUnhandledRejection";
import { Command, CommandError } from "./types";

export const autoStartCommandIfNeeded = async (
  command: Command,
  fileName: string,
): Promise<void> => {
  const logger = console;
  if ((process.mainModule || ({} as any)).filename === fileName) {
    try {
      configureExitOnUnhandledRejection();
      await command({ logger });
    } catch (e) {
      if (e instanceof CommandError) {
        logger.log(chalk.red(e.message));
      } else {
        logger.log(e);
      }
      process.exit(1);
    }
  }
};
