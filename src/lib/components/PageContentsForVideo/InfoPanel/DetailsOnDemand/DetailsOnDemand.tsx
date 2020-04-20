import React from "react";
import styled from "styled-components";

import { VideoInfo } from "../../../../resources/videos/types";
import { mobileMedia } from "../../styling";
import TabWithEasterEggs from "./TabWithEasterEggs";
import TabWithLinks from "./TabWithLinks";
import TabWithSummary from "./TabWithSummary";

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
  padding-bottom: 10px;

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
    padding-right: 15px;
  }

  .no-touchscreen &:hover {
    color: #000;
    text-decoration: none;
    border-bottom: #666;
  }
`;

const TabBodyContainer = styled.div`
  overflow: scroll;
`;

export interface DetailsOnDemandProps {
  videoInfo: VideoInfo;
  activeTimeOffset: number;
  onActiveTimeOffsetChange: React.Dispatch<React.SetStateAction<number>>;
}

const tabMaterialLookup = {
  summary: { name: "summary", Body: TabWithSummary },
  easterEggs: { name: "easter eggs", Body: TabWithEasterEggs },
  links: { name: "links", Body: TabWithLinks },
};

const defaultTab = Object.keys(tabMaterialLookup)[1];

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
