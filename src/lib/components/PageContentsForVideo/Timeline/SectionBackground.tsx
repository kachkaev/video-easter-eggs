import React from "react";
import { useQuery } from "react-query";
import styled from "styled-components";

import { FrameStripe, VideoInfo } from "../../../resources/videos/types";
import { extractHexColorDelta } from "./extractHexColorDelta";

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

/**
 * @param sectionIndex can be -1 when applying against sectionToDiffIndex
 */
const useFrameStripes = (videoInfo: VideoInfo, sectionIndex: number) => {
  const firstSectionIndex =
    Math.floor(sectionIndex / sectionGroupSize) * sectionGroupSize;
  const lastSectionIndex =
    sectionIndex >= 0
      ? Math.min(
          firstSectionIndex + sectionGroupSize,
          videoInfo.labeledSections.length - 1,
        )
      : firstSectionIndex;

  const groupTimeDuration = React.useMemo(() => {
    let result = 0;
    for (let index = firstSectionIndex; index <= lastSectionIndex; index++) {
      result += videoInfo.labeledSections[index]?.timeDuration ?? 0;
    }
    return result;
  }, [videoInfo.labeledSections, firstSectionIndex, lastSectionIndex]);

  const timeOffsetWithinGroup = React.useMemo(() => {
    let result = 0;
    for (let index = firstSectionIndex; index < sectionIndex; index++) {
      result += videoInfo.labeledSections[index]?.timeDuration ?? 0;
    }
    return result;
  }, [firstSectionIndex, sectionIndex, videoInfo.labeledSections]);

  const groupTimeOffset =
    videoInfo.labeledSections[firstSectionIndex]?.timeOffset ?? 0;

  const groupFirstFrameOffset = Math.floor(
    groupTimeOffset / videoInfo.frameSamplingInterval,
  );

  const groupFrameCount = Math.floor(
    groupTimeDuration / videoInfo.frameSamplingInterval,
  );

  const needsSkipping = groupFrameCount === 0 && groupFirstFrameOffset === 0;

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
    config: {
      manual: needsSkipping,
    },
  });

  if (!result.data || needsSkipping) {
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
  sectionToDiffIndex: number;
}

const TimelineSectionBackground: React.FunctionComponent<TimelineSectionBackgroundProps> = ({
  frameStripeWidth,
  videoInfo,
  sectionIndex,
  sectionToDiffIndex,
  ...rest
}) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  const frameStripes = useFrameStripes(videoInfo, sectionIndex);
  const frameStripesToDiff = useFrameStripes(videoInfo, sectionToDiffIndex);

  const canvasWidth =
    Math.round(
      videoInfo.labeledSections[sectionIndex].timeDuration /
        videoInfo.frameSamplingInterval,
    ) * frameStripeWidth;
  const canvasHeight = videoInfo.frameStripeHeight;

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx) {
      return;
    }

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    for (
      let frameIndex = 0;
      frameIndex < frameStripes.length;
      frameIndex += 1
    ) {
      const frameStripe = frameStripes[frameIndex];
      const frameStripeToDiff = frameStripesToDiff[frameIndex];
      for (
        let colorIndex = 0;
        colorIndex < frameStripe.length;
        colorIndex += 1
      ) {
        const hexColorCode = frameStripeToDiff?.[colorIndex]
          ? extractHexColorDelta(
              frameStripe[colorIndex],
              frameStripeToDiff[colorIndex],
            )
          : frameStripe[colorIndex];
        ctx.fillStyle = `#${hexColorCode}`;
        ctx.fillRect(
          frameIndex * frameStripeWidth,
          colorIndex,
          frameStripeWidth,
          1,
        );
      }
    }
  }, [
    frameStripes,
    frameStripesToDiff,
    canvasWidth,
    frameStripeWidth,
    canvasHeight,
  ]);

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
