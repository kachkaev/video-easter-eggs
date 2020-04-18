import { S3 } from "aws-sdk";

import { getS3ResourceStorageConfig } from "../envBasedConfigs";
import { ResourceStorageMaterial } from "./types";

const s3 = new S3({
  credentials: {
    accessKeyId: getS3ResourceStorageConfig().AWS_ACCESS_KEY_ID,
    secretAccessKey: getS3ResourceStorageConfig().AWS_SECRET_ACCESS_KEY,
  },
  region: getS3ResourceStorageConfig().S3_RESOURCE_STORAGE_REGION,
});

export const s3ResourceStorageMaterial: ResourceStorageMaterial = {
  resolvePath: (relativeResourcePath) => relativeResourcePath,

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

    return data.Body?.valueOf();
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
