import React from "react";

import Section from "./Section";
import { TimelineListElementData } from "./types";

export interface TimelineListElementProps {
  style: React.CSSProperties;
  index: number;
  data: TimelineListElementData;
}

const TimelineListElement: React.FunctionComponent<TimelineListElementProps> = ({
  style,
  index,
  data,
}) => {
  const { videoInfo, activeTimeOffset } = data;
  const sectionIndex = index - data.dummyElementCountAtStart;
  const { timeOffset = -1, timeDuration = 0 } =
    videoInfo.labeledSections[sectionIndex] ?? {};

  const activeTimeOffsetToPass =
    typeof activeTimeOffset === "number" &&
    activeTimeOffset >= timeOffset &&
    activeTimeOffset < timeOffset + timeDuration
      ? activeTimeOffset
      : undefined;

  const memoizedStyle = React.useMemo(
    () => style,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    Object.entries(style).flat(),
  );

  if (!timeDuration) {
    return null;
  }

  return (
    <Section
      style={memoizedStyle}
      sectionIndex={sectionIndex}
      {...data}
      activeTimeOffset={activeTimeOffsetToPass}
    />
  );
};

export default React.memo(TimelineListElement);