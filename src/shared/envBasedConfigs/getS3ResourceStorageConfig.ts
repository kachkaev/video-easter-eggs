import envalid from "envalid";
import _ from "lodash";

import { customReporter } from "./customReporter";

export const getS3ResourceStorageConfig = _.memoize(() => {
  const env = envalid.cleanEnv(
    process.env,
    {
      /* eslint-disable @typescript-eslint/naming-convention */
      S3_RESOURCE_STORAGE_ACCESS_KEY_ID: envalid.str(),
      S3_RESOURCE_STORAGE_SECRET_ACCESS_KEY: envalid.str(),
      S3_RESOURCE_STORAGE_BUCKET: envalid.str(),
      S3_RESOURCE_STORAGE_REGION: envalid.str(),
      /* eslint-enable @typescript-eslint/naming-convention */
    },
    { reporter: customReporter, strict: true },
  );

  return {
    ...env,
  };
});
