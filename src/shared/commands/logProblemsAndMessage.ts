import chalk from "chalk";

import {
  BaseProblem,
  dumpProblems,
  filterProblemsBySeverity,
} from "../problems";
import { CommandError } from "./types";

interface Options {
  throwOnErrors?: boolean;
  throwOnWarnings?: boolean;
}

export const logProblemsAndMessage = (
  logger: Console,
  problems: readonly BaseProblem[],
  [messageWhenErrors, messageWhenWarnings, messageWhenOk]: [
    string?,
    string?,
    string?,
  ] = ["Found problems.", "Found defects.", "No problems found!"],
  { throwOnErrors, throwOnWarnings }: Options = {},
) => {
  const errors = filterProblemsBySeverity(problems, "error");
  const warnings = filterProblemsBySeverity(problems, "warning");

  let style = chalk.reset;
  let message = messageWhenOk;

  if (errors.length) {
    style = chalk.red;
    message = messageWhenErrors;
  } else if (problems.length) {
    style = chalk.yellow;
    message = messageWhenWarnings;
  }

  if (errors.length) {
    logger.log(dumpProblems(errors));
  }

  if (warnings.length) {
    logger.log(dumpProblems(warnings));
  }

  if (errors.length && throwOnErrors) {
    throw new CommandError(message);
  }

  if (warnings.length && throwOnWarnings) {
    throw new CommandError(message);
  }

  if (problems.length && message) {
    logger.log("");
  }

  if (message) {
    logger.log(style(message));
  }
};
