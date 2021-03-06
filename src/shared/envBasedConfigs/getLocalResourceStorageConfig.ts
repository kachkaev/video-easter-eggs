import envalid from "envalid";
import _ from "lodash";

import { customReporter } from "./customReporter";

export const getLocalResourceStorageConfig = _.memoize(() => {
  const env = envalid.cleanEnv(
    process.env,
    {
      LOCAL_RESOURCE_STORAGE_DIR: envalid.str(),
    },
    { reporter: customReporter, strict: true },
  );

  return {
    ...env,
  };
});
