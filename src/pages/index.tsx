import { GetServerSideProps, NextPage } from "next";
import React from "react";

import { getVideoApiData } from "../lib/api";
import PageContentsForIndex from "../lib/components/PageContentsForIndex";
import { ProcessedVideoInfo } from "../lib/types";

interface IndexPageProps {
  processedVideoInfo: ProcessedVideoInfo;
}

const IndexPage: NextPage<IndexPageProps> = ({ processedVideoInfo }) => {
  return <PageContentsForIndex processedVideoInfo={processedVideoInfo} />;
};

export const getServerSideProps: GetServerSideProps<IndexPageProps> = async () => {
  const processedVideoInfo = (await getVideoApiData()).info;
  return {
    props: { processedVideoInfo },
  };
};

export default IndexPage;
