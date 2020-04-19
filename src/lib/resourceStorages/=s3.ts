import { S3 } from "aws-sdk";
import _ from "lodash";

import { getS3ResourceStorageConfig } from "../envBasedConfigs";
import { ResourceStorageMaterial } from "./types";

const getS3 = _.memoize(
  () =>
    new S3({
      credentials: {
        accessKeyId: getS3ResourceStorageConfig()
          .S3_RESOURCE_STORAGE_ACCESS_KEY_ID,
        secretAccessKey: getS3ResourceStorageConfig()
          .S3_RESOURCE_STORAGE_SECRET_ACCESS_KEY,
      },
      region: getS3ResourceStorageConfig().S3_RESOURCE_STORAGE_REGION,
    }),
);

export const s3ResourceStorageMaterial: ResourceStorageMaterial = {
  resolvePath: (relativeResourcePath) => relativeResourcePath,

  getPublicResourcesBaseUrl: () =>
    `https://${getS3ResourceStorageConfig().S3_RESOURCE_STORAGE_BUCKET}.s3.${
      getS3ResourceStorageConfig().S3_RESOURCE_STORAGE_REGION
    }.amazonaws.com`,

  getResource: async (
    resolvedPath: string,
    asString?: boolean,
  ): Promise<any> => {
    const data = await getS3()
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
    await getS3()
      .putObject({
        Bucket: getS3ResourceStorageConfig().S3_RESOURCE_STORAGE_BUCKET,
        Key: resolvedPath,
        Body: contents,
      })
      .promise();
  },
  maxAgeOfCachedValue: 5 * 60 * 1000,
  maxDurationOfGet: 60 * 1000,
};
