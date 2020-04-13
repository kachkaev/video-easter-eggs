import App from "next/app";
import React from "react";
import { ReactQueryConfigProvider } from "react-query";

import PageLayout from "../lib/components/PageLayout";

const queryConfig = { refetchAllOnWindowFocus: false };

class MyApp extends App {
  componentDidMount() {
    document.body.className = (document.body.className || "").replace(
      "no-js",
      "js",
    );
  }
  render() {
    const { Component, pageProps } = this.props;

    return (
      <ReactQueryConfigProvider config={queryConfig}>
        <PageLayout>
          <Component {...pageProps} />
        </PageLayout>
      </ReactQueryConfigProvider>
    );
  }
}

export default MyApp;
