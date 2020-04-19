export interface GetResourceOptions {
  asString?: boolean;
}

type GetResource = ((
  resolvedPath: string,
  asString?: false,
) => Promise<Buffer>) &
  ((resolvedPath: string, asString: true) => Promise<string>);

export interface ResourceStorageMaterial {
  resolvePath: (relativeResourcePath: string) => string;
  getPublicResourcesBaseUrl: () => string | undefined;
  getResource: GetResource;
  putResource: (
    resolvedPath: string,
    contents: Buffer | string,
  ) => Promise<void>;
  maxAgeOfCachedValue: number;
  maxDurationOfGet: number;
}
