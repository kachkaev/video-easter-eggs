import { GetServerSideProps, NextPage } from "next";
import ErrorPage from "next/error";
import Head from "next/head";
import React from "react";

import PageContentsForVideo from "../lib/components/PageContentsForVideo";
import { getVideoInfo } from "../lib/io/api";
import { VideoInfo } from "../lib/resources/videos";

const VideoPage: NextPage<{
  videoInfo?: VideoInfo;
}> = ({ videoInfo }) => {
  if (!videoInfo) {
    return <ErrorPage statusCode={404} />;
  }
  return (
    <>
      <Head>
        <title>{videoInfo.shortTitle}</title>
      </Head>
      <PageContentsForVideo videoInfo={videoInfo} />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const videoId = `${query.videoId}`;
  try {
    return {
      props: {
        videoInfo: await getVideoInfo(videoId),
      },
    };
  } catch {
    return { props: {} };
  }
};

export default VideoPage;
