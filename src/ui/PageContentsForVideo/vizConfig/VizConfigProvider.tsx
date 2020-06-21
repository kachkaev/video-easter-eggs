import React from "react";

import { VizConfig, VizConfigContextValue } from "./types";
import { VizConfigContext } from "./VizConfigContext";

export const VizConfigProvider: React.FunctionComponent = ({ children }) => {
  const [vizConfig, setVizConfig] = React.useState<VizConfig>({
    highlightEasterEggs: true,
    diffWithActiveSection: false,
  });

  const providerValue = React.useMemo<VizConfigContextValue>(
    () => ({
      vizConfig,
      setVizConfig,
    }),
    [vizConfig, setVizConfig],
  );

  return (
    <VizConfigContext.Provider value={providerValue}>
      {children}
    </VizConfigContext.Provider>
  );
};
