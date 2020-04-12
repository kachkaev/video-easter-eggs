import chalk, { ChalkFunction } from "chalk";
import _ from "lodash";
import PQueue from "p-queue";

import { getCommonConfig } from "../envBasedConfigs";
import { dumpProblems, initProblems, problemMaterialLookup } from "../problems";
import { FileMappingProblem } from "../problems/=fileMapping";
import { detectIfCanBeSkipped } from "./detectIfCanBeSkipped";
import { dumpFileMapping } from "./dumpFileMapping";
import { getFileMappingMaterial } from "./materials";
import { BaseFileMapping, ProcessingResult } from "./types";

const orderFileMappingsToReduceCaptionLogs = (
  fileMappings: BaseFileMapping[],
) =>
  _.orderBy(fileMappings, (fileMapping) => {
    return [
      getFileMappingMaterial(fileMapping.type).priority,
      fileMapping.sourcePath,
    ].join("|");
  });

const styleIfNotZero = (arg: number, style: ChalkFunction): string =>
  arg === 0 ? "0" : style(arg);

const processFileMapping = async (
  fileMapping: BaseFileMapping,
  logger: Console,
  previouslyLoggedDataMapping?: BaseFileMapping,
): Promise<void> => {
  const fileMappingMaterial = getFileMappingMaterial(fileMapping.type);

  const logCaption =
    !previouslyLoggedDataMapping ||
    previouslyLoggedDataMapping.type !== fileMapping.type;

  logger.log(
    dumpFileMapping({
      fileMapping,
      logCaption,
      styleTargetFilePath: chalk.cyan,
    }),
  );

  await fileMappingMaterial.process(fileMapping);
};

export const processFileMappings = async (
  fileMappings: BaseFileMapping[],
  logger: Console,
): Promise<ProcessingResult> => {
  const fileMappingsBySourcePath: Record<string, BaseFileMapping[]> = {};
  const targetPathLookup: Record<string, true> = {};
  for (const fileMapping of fileMappings) {
    if (!fileMappingsBySourcePath[fileMapping.sourcePath]) {
      fileMappingsBySourcePath[fileMapping.sourcePath] = [];
    }
    fileMappingsBySourcePath[fileMapping.sourcePath].push(fileMapping);
    targetPathLookup[fileMapping.targetPath] = true;
  }

  const processingQueue = new PQueue({
    concurrency: getCommonConfig().QUEUE_CONCURRENCY,
  });

  let previouslyLoggedDataMapping: BaseFileMapping | undefined = undefined;
  const failedFileMappings: BaseFileMapping[] = [];
  const completeFileMappings: BaseFileMapping[] = [];
  const skippedFileMappings: BaseFileMapping[] = [];
  const [getProblems, reportProblem] = initProblems<FileMappingProblem>();

  let unblockedFileMappings = fileMappings.filter(
    (fileMapping) => !targetPathLookup[fileMapping.sourcePath],
  );

  while (unblockedFileMappings.length) {
    const fileMappingsToProcess = orderFileMappingsToReduceCaptionLogs(
      unblockedFileMappings,
    );
    unblockedFileMappings = [];
    fileMappingsToProcess.forEach((fileMapping) => {
      processingQueue.add(async () => {
        if (!(await detectIfCanBeSkipped(fileMapping))) {
          try {
            const processing = processFileMapping(
              fileMapping,
              logger,
              previouslyLoggedDataMapping,
            );
            previouslyLoggedDataMapping = fileMapping;
            await processing;
          } catch (error) {
            failedFileMappings.push(fileMapping);
            reportProblem(
              problemMaterialLookup.fileMapping.createProblem({
                fileMapping,
                error,
              }),
            );
          }
          completeFileMappings.push(fileMapping);
        } else {
          skippedFileMappings.push(fileMapping);
        }
        const dependentFileMappings =
          fileMappingsBySourcePath[fileMapping.targetPath];
        if (dependentFileMappings) {
          unblockedFileMappings.push(...dependentFileMappings);
        }
      });
    });
    await processingQueue.onIdle();
  }

  const problems = getProblems();

  if (completeFileMappings.length) {
    logger.log("");
  }
  logger.log(
    `Mappings total: ${fileMappings.length}. Done: ${styleIfNotZero(
      completeFileMappings.length,
      chalk.cyan,
    )}. Skipped: ${styleIfNotZero(
      skippedFileMappings.length,
      chalk.gray,
    )}. Errors: ${styleIfNotZero(failedFileMappings.length, chalk.red)}.`,
  );

  if (problems.length) {
    logger.log(dumpProblems(problems));
  }

  return {
    completeFileMappings,
    failedFileMappings,
    skippedFileMappings,
    problems,
  };
};
