import React from "react";

import Section from "./Section";
import { TimelineElementData } from "./types";

export interface TimelineElementProps {
  style: React.CSSProperties;
  index: number;
  data: TimelineElementData;
}

const TimelineElement: React.FunctionComponent<TimelineElementProps> = ({
  style,
  index,
  data,
}) => {
  const { videoInfo, activeTimeOffset } = data;
  const { timeOffset, timeDuration } = videoInfo.labeledSections[index];

  const activeTimeOffsetToPass =
    typeof activeTimeOffset === "number" &&
    activeTimeOffset >= timeOffset &&
    activeTimeOffset < timeOffset + timeDuration
      ? activeTimeOffset
      : undefined;

  return (
    <Section
      style={style}
      index={index}
      {...data}
      activeTimeOffset={activeTimeOffsetToPass}
    />
  );
};

export default React.memo(TimelineElement);
