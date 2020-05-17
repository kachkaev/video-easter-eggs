import React from "react";

import { VizConfigContextValue } from "./types";

const VizConfigContext = React.createContext<VizConfigContextValue | undefined>(
  undefined,
);

export default VizConfigContext;
