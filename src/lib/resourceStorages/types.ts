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
  getResource: GetResource;
  putResource: (
    resolvedPath: string,
    contents: Buffer | string,
  ) => Promise<void>;
}
