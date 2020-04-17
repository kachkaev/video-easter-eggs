import getConfig from "next/config";

export const getResourceStorageType = () =>
  getConfig().serverRuntimeConfig.resourceStorageType;
