import * as React from "react";

import { ActiveTimeOffsetContextValue } from "./types";

export const ActiveTimeOffsetContext = React.createContext<
  ActiveTimeOffsetContextValue | undefined
>(undefined);
