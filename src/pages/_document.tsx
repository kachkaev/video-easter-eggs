import Document, { Head, Html, Main, NextScript } from "next/document";
import React from "react";
import { ServerStyleSheet } from "styled-components";

const InlineJs: React.FunctionComponent<{ code: string; children?: never }> = ({
  code,
}) => {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: code.replace(/\/\*.*\*\//g, " ").replace(/\s+/g, " "),
      }}
    />
  );
};

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            sheet.collectStyles(<App {...props} />),
        });

      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      };
    } finally {
      sheet.seal();
    }
  }

  render() {
    return (
      <Html>
        <Head />
        <body className="no-js touchscreen">
          <InlineJs
            code={`
            if (!("ontouchstart" in document.documentElement)) {
              document.body.className = (document.body.className || "").replace("touchscreen", "no-touchscreen");
            }
            `}
          />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
