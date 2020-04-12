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
  );

  return result.data || [];
};

const Wrapper = styled.div`
  position: relative;
`;
const Canvas = styled.canvas`
  background: #ccc;
  position: absolute;
`;

const ActiveFrame = styled.div`
  background: red;
  pointer-events: none;
  background: red;
  opacity: 0.5;
  height: 100%;
  position: absolute;
`;

const TimelineSegment: React.FunctionComponent<{
  activeTimeOffset?: number;
  frameStripeWidth: number;
  onActiveTimeOffsetChange?: (value: number) => void;
  timeOffsetInterval: number;
  timeOffsetStart: number;
  videoInfo: VideoInfo;
}> = ({
  activeTimeOffset,
  frameStripeWidth,
  onActiveTimeOffsetChange,
  timeOffsetInterval,
  timeOffsetStart,
  videoInfo,
}) => {
  const firstFrameOffset = Math.floor(
    timeOffsetStart / videoInfo.thumbnailInterval,
  );
  const frameCount = Math.floor(
    timeOffsetInterval / videoInfo.thumbnailInterval,
  );

  const canvasWidth = frameCount * frameStripeWidth;
  const canvasHeight = videoInfo.frameStripeHeight;
  const activeFrameX =
    typeof activeTimeOffset === "number" &&
    activeTimeOffset >= timeOffsetStart &&
    activeTimeOffset < timeOffsetStart + timeOffsetInterval
      ? Math.floor(
          (activeTimeOffset - timeOffsetStart) / videoInfo.thumbnailInterval,
        ) * frameStripeWidth
      : undefined;

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
  }, [frameStripes, canvasWidth, canvasHeight, frameStripeWidth]);

  const handleWrapperMouseDown: React.MouseEventHandler = React.useCallback(
    (e) => {
      const x = e.nativeEvent.offsetX;
      if (onActiveTimeOffsetChange) {
        onActiveTimeOffsetChange(
          timeOffsetStart +
            Math.floor(x / frameStripeWidth) * videoInfo.thumbnailInterval,
        );
      }
    },
    [
      frameStripeWidth,
      onActiveTimeOffsetChange,
      timeOffsetStart,
      videoInfo.thumbnailInterval,
    ],
  );

  return (
    <Wrapper
      onMouseDown={handleWrapperMouseDown}
      style={{
        width: canvasWidth,
        height: canvasHeight,
      }}
    >
      <Canvas width={canvasWidth} height={canvasHeight} ref={canvasRef} />
      {typeof activeFrameX === "number" ? (
        <ActiveFrame style={{ left: activeFrameX, width: frameStripeWidth }} />
      ) : null}
    </Wrapper>
  );
};

export default React.memo(TimelineSegment);
