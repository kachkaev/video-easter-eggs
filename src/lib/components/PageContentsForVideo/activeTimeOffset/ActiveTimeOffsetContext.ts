import React from "react";

import { ActiveTimeOffsetContextValue } from "./types";

const ActiveTimeOffsetContext = React.createContext<
  ActiveTimeOffsetContextValue | undefined
>(undefined);

export default ActiveTimeOffsetContext;
