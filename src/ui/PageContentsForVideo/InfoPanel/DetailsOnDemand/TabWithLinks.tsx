import React from "react";

import { ExternalLink } from "../../../shared/ExternalLink";
import { useVideoInfo } from "../../videoInfo";
import { TabBody } from "./shared/TabBody";
import { TabProps } from "./types";

const TabWithLinks: React.FunctionComponent<TabProps> = ({
  active: hidden,
}) => {
  const videoInfo = useVideoInfo();

  return (
    <TabBody active={hidden}>
      <p style={{ whiteSpace: "nowrap" }}>
        ✏️ by{" "}
        <ExternalLink href="https://en.kachkaev.ru">
          Alexander Kachkaev
        </ExternalLink>
        <br />
        {videoInfo.urlOfCommentWithTimeCodes ? (
          <>
            👀{" "}
            <ExternalLink href={videoInfo.urlOfCommentWithTimeCodes}>
              Comment with time codes
            </ExternalLink>
            <br />
          </>
        ) : null}
        💻{" "}
        <ExternalLink href="https://github.com/kachkaev/video-easter-eggs">
          Source on GitHub
        </ExternalLink>
      </p>
      <p>
        📖{" "}
        <ExternalLink href="https://en.wikipedia.org/wiki/Easter_egg_(media)">
          Easter eggs in media
        </ExternalLink>
        <br />
        📖{" "}
        <ExternalLink href="https://en.wikipedia.org/wiki/Visual_analytics">
          Visual analytics method
        </ExternalLink>
      </p>
    </TabBody>
  );
};

const WrappedTabWithLinks = React.memo(TabWithLinks);
export { WrappedTabWithLinks as TabWithLinks };
