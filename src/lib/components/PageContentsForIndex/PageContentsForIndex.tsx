import React from "react";

import { ProcessedVideoInfo } from "../../types";

const PageContentsForIndex: React.FunctionComponent<{
  processedVideoInfo: ProcessedVideoInfo;
}> = ({ processedVideoInfo }) => {
  return (
    <>
      <a
        href={processedVideoInfo.url}
        target="_blank"
        rel="noopener noreferrer"
      >
        {processedVideoInfo.url}
      </a>
      <div>
        <b>{processedVideoInfo.frameStripeHeight}</b>
      </div>
    </>
  );
};

export default PageContentsForIndex;
