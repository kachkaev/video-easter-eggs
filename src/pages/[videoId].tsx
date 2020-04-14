import { NextPage } from "next";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React from "react";

const PageContentsForVideo = dynamic(
  () => import("../lib/components/PageContentsForVideo"),
  { ssr: false },
);

const VideoPage: NextPage = () => {
  const router = useRouter();
  const videoId = `${router.query.videoId}`;

  return <PageContentsForVideo videoId={videoId} />;
};

export default VideoPage;
