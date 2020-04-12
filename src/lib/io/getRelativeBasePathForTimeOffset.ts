import { Duration } from "luxon";

export const getRelativeBasePathForTimeOffset = (timeOffset: number) => {
  const timeOffsetAsDuration = Duration.fromMillis(timeOffset);
  return [
    timeOffsetAsDuration.toFormat("hh-xx-xx"),
    timeOffsetAsDuration.toFormat("hh-mm-ss.SSS"),
  ].join("/");
};
