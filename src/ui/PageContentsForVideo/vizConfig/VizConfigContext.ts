import React from "react";

import { VizConfigContextValue } from "./types";

export const VizConfigContext = React.createContext<
  VizConfigContextValue | undefined
>(undefined);
