import React from "react";
import { useQuery } from "react-query";
import styled from "styled-components";

import { FrameStripe, VideoInfo } from "../../../videoResources/types";

const getFrameStripes = async (
  _,
  videoId: string,
  timeOffsetStart: number,
  timeOffsetInterval: number,
  frameSamplingInterval: number,
) => {
  const firstFrameOffset = Math.floor(timeOffsetStart / frameSamplingInterval);
  const frameCount = Math.floor(timeOffsetInterval / frameSamplingInterval);
  return await (
    await fetch(
      `/api/videos/${videoId}/frameStripes?firstFrameOffset=${firstFrameOffset}&frameCount=${frameCount}`,
    )
  ).json();
};
const useFrameStripes = (
  videoInfo: VideoInfo,
  timeOffsetStart: number,
  timeOffsetInterval: number,
) => {
  const result = useQuery<
    FrameStripe[],
    [string, string, number, number, number]
  >(
    [
      "frameStripes",
      videoInfo.id,
      timeOffsetStart,
      timeOffsetInterval,
      videoInfo.frameSamplingInterval,
    ],
    getFrameStripes,
  );

  return result.data || [];
};

const Canvas = styled.canvas`
  background: #ccc;
  position: absolute;
`;

const TimelineSegment: React.FunctionComponent<{
  frameStripeWidth: number;
  timeOffsetInterval: number;
  timeOffsetStart: number;
  videoInfo: VideoInfo;
}> = ({ frameStripeWidth, videoInfo, timeOffsetInterval, timeOffsetStart }) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  const frameStripes = useFrameStripes(
    videoInfo,
    timeOffsetStart,
    timeOffsetInterval,
  );

  const canvasWidth = frameStripes.length * frameStripeWidth;
  const canvasHeight = videoInfo.frameStripeHeight;

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx) {
      return;
    }

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    frameStripes.forEach((frameStripe, frameIndex) => {
      frameStripe.forEach((colorHex, colorIndex) => {
        ctx.fillStyle = `#${colorHex}`;
        ctx.fillRect(
          frameIndex * frameStripeWidth,
          colorIndex,
          frameStripeWidth,
          1,
        );
      });
    });
  }, [frameStripes, canvasWidth, frameStripeWidth, canvasHeight]);

  return <Canvas width={canvasWidth} height={canvasHeight} ref={canvasRef} />;
};

export default React.memo(TimelineSegment);
