import { GetServerSideProps, NextPage } from "next";
import ErrorPage from "next/error";
import Head from "next/head";
import React from "react";

import { getVideoInfo } from "../shared/io/api";
import { VideoInfo } from "../shared/resources/videos";
import PageContentsForVideo from "../ui/PageContentsForVideo";

const VideoPage: NextPage<{
  videoInfo?: VideoInfo;
}> = ({ videoInfo }) => {
  if (!videoInfo) {
    return <ErrorPage statusCode={404} />;
  }
  return (
    <>
      <Head>
        <title>{videoInfo.pageTitle || videoInfo.shortTitle}</title>
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
