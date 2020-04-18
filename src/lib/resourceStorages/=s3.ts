import { S3 } from "aws-sdk";
import path from "path";

import {
  getCommonConfig,
  getS3ResourceStorageConfig,
} from "../envBasedConfigs";
import { ResourceStorageMaterial } from "./types";

const s3 = new S3();

export const s3StorageMaterial: ResourceStorageMaterial = {
  resolvePath: (relativeResourcePath) =>
    path.resolve(getCommonConfig().VAR_DIR, relativeResourcePath),

  getResource: async (
    resolvedPath: string,
    asString?: boolean,
  ): Promise<any> => {
    const data = await s3
      .getObject({
        Bucket: getS3ResourceStorageConfig().S3_RESOURCE_STORAGE_BUCKET,
        Key: resolvedPath,
      })
      .promise();

    if (asString) {
      return data.Body?.toString("utf-8");
    }

    return data.Body;
  },

  putResource: async (resolvedPath, contents) => {
    await s3
      .putObject({
        Bucket: getS3ResourceStorageConfig().S3_RESOURCE_STORAGE_BUCKET,
        Key: resolvedPath,
        Body: contents,
      })
      .promise();
  },
};
