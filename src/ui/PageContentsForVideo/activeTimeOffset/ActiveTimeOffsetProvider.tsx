import * as React from "react";

import { ActiveTimeOffsetContext } from "./ActiveTimeOffsetContext";
import { ActiveTimeOffsetContextValue } from "./types";

export const ActiveTimeOffsetProvider: React.FunctionComponent = ({
  children,
}) => {
  const [activeTimeOffset, setActiveTimeOffset] = React.useState<number>(0);

  const providerValue = React.useMemo<ActiveTimeOffsetContextValue>(
    () => ({
      activeTimeOffset,
      setActiveTimeOffset,
    }),
    [activeTimeOffset, setActiveTimeOffset],
  );

  return (
    <ActiveTimeOffsetContext.Provider value={providerValue}>
      {children}
    </ActiveTimeOffsetContext.Provider>
  );
};
