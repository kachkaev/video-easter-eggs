import React from "react";

import { VizConfigContextValue } from "./types";
import { VizConfigContext } from "./VizConfigContext";

export const useVizConfig = (): VizConfigContextValue => {
  const result = React.useContext(VizConfigContext);
  if (result === undefined) {
    throw new Error("No VizConfigContext value available");
  }
  return result;
};
