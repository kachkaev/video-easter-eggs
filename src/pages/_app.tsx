import { AppProps } from "next/app";
import React from "react";
import { ReactQueryConfig, ReactQueryConfigProvider } from "react-query";

import { PageLayout } from "../ui/PageLayout";

const queryConfig: ReactQueryConfig = {
  queries: {
    cacheTime: Number.POSITIVE_INFINITY,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: Number.POSITIVE_INFINITY,
  },
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
