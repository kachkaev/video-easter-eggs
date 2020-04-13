import React from "react";
import { useQuery } from "react-query";
import styled from "styled-components";

import { FrameStripes, VideoInfo } from "../../../types";

const getFrameStripes = async (
  _,
  firstFrameOffset: number,
  frameCount: number,
) =>
  await (
    await fetch(
      `/api/videoFrameStripes?firstFrameOffset=${firstFrameOffset}&frameCount=${frameCount}`,
    )
  ).json();

const useFrameStripes = (firstFrameOffset: number, frameCount: number) => {
  const result = useQuery<FrameStripes, [string, number, number]>(
    ["frameStripes", firstFrameOffset, frameCount],
    getFrameStripes,
    { refetchOnWindowFocus: false, cacheTime: Number.MAX_SAFE_INTEGER },
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
  const firstFrameOffset = Math.floor(
    timeOffsetStart / videoInfo.thumbnailInterval,
  );

  const frameCount = Math.floor(
    timeOffsetInterval / videoInfo.thumbnailInterval,
  );

  const canvasWidth = frameCount * frameStripeWidth;
  const canvasHeight = videoInfo.frameStripeHeight;

  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  const frameStripes = useFrameStripes(firstFrameOffset, frameCount);

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
