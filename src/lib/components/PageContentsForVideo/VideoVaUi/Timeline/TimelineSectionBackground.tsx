import React from "react";
import { useQuery } from "react-query";
import styled from "styled-components";

import { FrameStripe, VideoInfo } from "../../../../resources/videos/types";

type QueryKey = [
  string,
  {
    videoId: string;
    firstFrameOffset: number;
    frameCount: number;
  },
];

const getFrameStripes = async (
  ...[, { videoId, firstFrameOffset, frameCount }]: QueryKey
) => {
  return await (
    await fetch(
      `/api/videos/${videoId}/frameStripes?firstFrameOffset=${firstFrameOffset}&frameCount=${frameCount}`,
    )
  ).json();
};

const sectionGroupSize = 30;

const useFrameStripes = (videoInfo: VideoInfo, sectionIndex: number) => {
  const firstSectionIndex =
    Math.floor(sectionIndex / sectionGroupSize) * sectionGroupSize;
  const lastSectionIndex = Math.min(
    firstSectionIndex + sectionGroupSize,
    videoInfo.labeledSections.length - 1,
  );

  const groupTimeDuration = React.useMemo(() => {
    let result = 0;
    for (let index = firstSectionIndex; index <= lastSectionIndex; index++) {
      result += videoInfo.labeledSections[index].timeDuration;
    }
    return result;
  }, [videoInfo.labeledSections, firstSectionIndex, lastSectionIndex]);

  const timeOffsetWithinGroup = React.useMemo(() => {
    let result = 0;
    for (let index = firstSectionIndex; index < sectionIndex; index++) {
      result += videoInfo.labeledSections[index].timeDuration;
    }
    return result;
  }, [firstSectionIndex, sectionIndex, videoInfo.labeledSections]);

  const groupTimeOffset =
    videoInfo.labeledSections[firstSectionIndex].timeOffset;

  const groupFirstFrameOffset = Math.floor(
    groupTimeOffset / videoInfo.frameSamplingInterval,
  );

  const groupFrameCount = Math.floor(
    groupTimeDuration / videoInfo.frameSamplingInterval,
  );

  const result = useQuery<FrameStripe[], QueryKey>({
    queryKey: [
      "frameStripes",
      {
        videoId: videoInfo.id,
        firstFrameOffset: groupFirstFrameOffset,
        frameCount: groupFrameCount,
      },
    ],
    queryFn: getFrameStripes,
  });

  if (!result.data) {
    return [];
  }

  const firstFrameIndex = Math.round(
    timeOffsetWithinGroup / videoInfo.frameSamplingInterval,
  );
  const frameCount = Math.round(
    videoInfo.labeledSections[sectionIndex].timeDuration /
      videoInfo.frameSamplingInterval,
  );
  return result.data.slice(firstFrameIndex, firstFrameIndex + frameCount);
};

const Canvas = styled.canvas`
  background: #ccc;
  position: absolute;
  pointer-events: none;
`;

export interface TimelineSectionBackgroundProps
  extends React.CanvasHTMLAttributes<HTMLCanvasElement> {
  frameStripeWidth: number;
  videoInfo: VideoInfo;
  sectionIndex: number;
}

const TimelineSectionBackground: React.FunctionComponent<TimelineSectionBackgroundProps> = ({
  frameStripeWidth,
  videoInfo,
  sectionIndex,
  ...rest
}) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  const frameStripes = useFrameStripes(videoInfo, sectionIndex);

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

  return (
    <Canvas
      {...rest}
      width={canvasWidth}
      height={canvasHeight}
      ref={canvasRef}
    />
  );
};

export default React.memo(TimelineSectionBackground);
