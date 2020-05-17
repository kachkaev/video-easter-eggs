export interface VizConfig {
  highlightEasterEggs: boolean;
  diffWithActiveSection: boolean;
}

export interface VizConfigContextValue {
  vizConfig: VizConfig;
  setVizConfig: React.Dispatch<React.SetStateAction<VizConfig>>;
}
