import React from "react";

import TabBody from "./components/TabBody";
import { TabProps } from "./types";

const TabWithSummary: React.FunctionComponent<TabProps> = ({
  videoInfo,
  active: hidden,
}) => {
  return (
    <TabBody active={hidden}>
      <p style={{ whiteSpace: "nowrap" }}>
        ✏️ by <a href="http://en.kachkaev.ru">Alexander Kachkaev</a>
        <br />
        {videoInfo.urlOfCommentWithTimeCodes ? (
          <>
            👀{" "}
            <a
              href={videoInfo.urlOfCommentWithTimeCodes}
              target="_blank"
              rel="noopener noreferrer"
            >
              Comment with time codes
            </a>
            <br />
          </>
        ) : null}
        💻{" "}
        <a
          href="https://github.com/kachkaev/video-easter-eggs"
          target="_blank"
          rel="noopener noreferrer"
        >
          Source on GitHub
        </a>
      </p>
      <p>
        📖{" "}
        <a
          href="https://en.wikipedia.org/wiki/Visual_analytics"
          target="_blank"
          rel="noopener noreferrer"
        >
          Visual analytics method
        </a>
        <br />
        📖{" "}
        <a
          href="https://en.wikipedia.org/wiki/Easter_egg_(media)"
          target="_blank"
          rel="noopener noreferrer"
        >
          Easter eggs in media
        </a>
      </p>
    </TabBody>
  );
};

export default React.memo(TabWithSummary);
