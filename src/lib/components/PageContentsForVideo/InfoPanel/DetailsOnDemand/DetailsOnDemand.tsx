import React from "react";
import styled from "styled-components";

import { VideoInfo } from "../../../../resources/videos/types";
import { mobileMedia } from "../../../styling";
import TabWithFindings from "./TabWithFindings";
import TabWithLinks from "./TabWithLinks";
import TabWithOverview from "./TabWithOverview";

const Wrapper = styled.div`
  flex-grow: 1;
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  font-size: 0.7em;
  line-height: 1.5em;

  ${mobileMedia} {
    padding-top: 7px;
  }
`;

const TabNameContainer = styled.div`
  display: flex;
  flex-basis: 1.5em;
  flex-shrink: 0;
  flex-grow: 0;
  padding-bottom: 10px;
  white-space: nowrap;
  overflow: scroll;

  ${mobileMedia} {
    display: block;
  }
`;

const TabName = styled.a<{ active: boolean }>`
  display: inline-block;
  flex-grow: 1;
  font-weight: bold;
  color: ${(p) => (p.active ? "#000" : "#888")};
  border-bottom: 1px solid rgba(0, 0, 0, 0);

  ${mobileMedia} {
    margin-right: 15px;

    &:last-child {
      margin-right: 0;
    }
  }

  .no-touchscreen &:hover {
    color: #000;
    text-decoration: none;
    border-bottom: #666;
  }
`;

const TabBodyContainer = styled.div`
  flex-grow: 1;
  position: relative;
  overflow: hidden;
`;

export interface DetailsOnDemandProps {
  videoInfo: VideoInfo;
  activeTimeOffset: number;
  onActiveTimeOffsetChange: React.Dispatch<React.SetStateAction<number>>;
}

const tabMaterialLookup = {
  overview: { name: "overview", Body: TabWithOverview },
  findings: { name: "findings", Body: TabWithFindings },
  links: { name: "links", Body: TabWithLinks },
};

const defaultTab = Object.keys(tabMaterialLookup)[0];

const DetailsOnDemand: React.FunctionComponent<DetailsOnDemandProps> = (
  props,
) => {
  const [activeTab, setActiveTab] = React.useState(defaultTab);

  const handleTabNameClick = React.useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      const newActiveTab = event.currentTarget.dataset["key"] ?? defaultTab;
      setActiveTab(newActiveTab);
    },
    [],
  );

  return (
    <Wrapper>
      <TabNameContainer>
        {Object.entries(tabMaterialLookup).map(([key, { name }]) => (
          <TabName
            href="#"
            key={key}
            data-key={key}
            active={activeTab === key}
            onClick={handleTabNameClick}
          >
            {name}
          </TabName>
        ))}
      </TabNameContainer>
      <TabBodyContainer>
        {Object.entries(tabMaterialLookup).map(([key, { Body }]) => (
          <Body key={key} {...props} active={activeTab === key} />
        ))}
      </TabBodyContainer>
    </Wrapper>
  );
};

export default React.memo(DetailsOnDemand);
