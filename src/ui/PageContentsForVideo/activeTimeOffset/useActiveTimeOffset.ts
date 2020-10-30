import React from "react";

import { ActiveTimeOffsetContext } from "./ActiveTimeOffsetContext";
import { ActiveTimeOffsetContextValue } from "./types";

export const useActiveTimeOffset = (): ActiveTimeOffsetContextValue => {
  const result = React.useContext(ActiveTimeOffsetContext);
  if (result === undefined) {
    throw new Error("No ActiveTimeOffsetContext value available");
  }

  return result;
};
