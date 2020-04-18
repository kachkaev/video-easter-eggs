import envalid from "envalid";
import _ from "lodash";

import { customReporter } from "./customReporter";

export const getS3ResourceStorageConfig = _.memoize(() => {
  const env = envalid.cleanEnv(
    process.env,
    {
      S3_RESOURCE_STORAGE_BUCKET: envalid.str(),
    },
    { reporter: customReporter, strict: true },
  );

  return {
    ...env,
  };
});
