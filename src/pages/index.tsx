import { GetServerSideProps, NextPage } from "next";
import dynamic from "next/dynamic";
import React from "react";

import { getVideoApiData } from "../lib/io/api";
import { VideoInfo } from "../lib/videoResources/types";

const PageContentsForIndex = dynamic(
  () => import("../lib/components/PageContentsForIndex"),
  { ssr: false },
);

interface IndexPageProps {
  videoInfo: VideoInfo;
}

const IndexPage: NextPage<IndexPageProps> = ({ videoInfo }) => {
  return <PageContentsForIndex videoInfo={videoInfo} />;
};

export const getServerSideProps: GetServerSideProps<IndexPageProps> = async () => {
  const videoInfo = (await getVideoApiData()).info;
  return {
    props: { videoInfo },
  };
};

export default IndexPage;
