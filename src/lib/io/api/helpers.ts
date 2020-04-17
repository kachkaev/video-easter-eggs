import getConfig from "next/config";

import { getResourceStorage } from "../../resourceStorages";

export const getApiResourceStorage = () =>
  getResourceStorage(getConfig().serverRuntimeConfig.resourceStorageType);
