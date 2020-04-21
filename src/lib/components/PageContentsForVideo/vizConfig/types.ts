export interface VizConfig {
  highlightEasterEggs: boolean;
  subtractActiveSection: boolean;
}

export interface VizConfigContextValue {
  vizConfig: VizConfig;
  setVizConfig: React.Dispatch<React.SetStateAction<VizConfig>>;
}
