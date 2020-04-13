import fs from "fs-extra";
import { safeDump, safeLoad, safeLoadAll } from "js-yaml";

export const readFromYaml = async <Value = unknown>(
  pathToFile: string,
): Promise<Value> => safeLoad(await fs.readFile(pathToFile, "utf8"));

export const readAllFromYaml = async <Value = unknown>(
  pathToFile: string,
): Promise<Value[]> => safeLoadAll(await fs.readFile(pathToFile, "utf8"));

export const readFromJson = async <Value = unknown>(
  pathToFile: string,
): Promise<Value> => fs.readJson(pathToFile);

export const writeToYaml = async <Value = unknown>(
  pathToFile: string,
  contents: Value,
): Promise<void> => await fs.writeFile(pathToFile, safeDump(contents), "utf8");

export const writeAllToYaml = async <Value = unknown>(
  pathToFile: string,
  contents: Value[],
): Promise<void> =>
  await fs.writeFile(
    pathToFile,
    contents
      .map((currentContents) => safeDump(currentContents))
      .join("\n---\n"),
    "utf8",
  );

export const writeToJson = async <Value = unknown>(
  pathToFile: string,
  contents: Value,
): Promise<void> => fs.writeJson(pathToFile, contents);
