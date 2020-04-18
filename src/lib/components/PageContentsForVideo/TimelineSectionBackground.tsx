import React from "react";
import { useQuery } from "react-query";
import styled from "styled-components";

import { FrameStripe, VideoInfo } from "../../resources/videos/types";

const getFrameStripes = async (
  _,
  videoId: string,
  timeOffset: number,
  timeDuration: number,
  frameSamplingInterval: number,
) => {
  const firstFrameOffset = Math.floor(timeOffset / frameSamplingInterval);
  const frameCount = Math.floor(timeDuration / frameSamplingInterval);
  return await (
    await fetch(
      `/api/videos/${videoId}/frameStripes?firstFrameOffset=${firstFrameOffset}&frameCount=${frameCount}`,
    )
  ).json();
};
const useFrameStripes = (
  videoInfo: VideoInfo,
  timeOffset: number,
  timeDuration: number,
) => {
  const result = useQuery<
    FrameStripe[],
    [string, string, number, number, number]
  >(
    [
      "frameStripes",
      videoInfo.id,
      timeOffset,
      timeDuration,
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

const TimelineSectionBackground: React.FunctionComponent<{
  frameStripeWidth: number;
  timeDuration: number;
  timeOffset: number;
  videoInfo: VideoInfo;
}> = ({ frameStripeWidth, videoInfo, timeDuration, timeOffset }) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  const frameStripes = useFrameStripes(videoInfo, timeOffset, timeDuration);

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

export default React.memo(TimelineSectionBackground);
