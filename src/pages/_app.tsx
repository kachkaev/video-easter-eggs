import { AppProps } from "next/app";
import React from "react";
import {
  ReactQueryConfigProvider,
  ReactQueryProviderConfig,
} from "react-query";

import { PageLayout } from "../ui/PageLayout";

const queryConfig: ReactQueryProviderConfig = {
  cacheTime: Number.POSITIVE_INFINITY,
  refetchAllOnWindowFocus: false,
  refetchInterval: false,
  refetchOnMount: false,
  staleTime: Number.POSITIVE_INFINITY,
};

const App: React.FunctionComponent<AppProps> = ({ Component, pageProps }) => {
  React.useEffect(() => {
    document.body.className = (document.body.className ?? "").replace(
      "no-js",
      "js",
    );
  }, []);

  return (
    <ReactQueryConfigProvider config={queryConfig}>
      <PageLayout>
        <Component {...pageProps} />
      </PageLayout>
    </ReactQueryConfigProvider>
  );
};

export default App;
