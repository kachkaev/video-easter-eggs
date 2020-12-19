import * as React from "react";

// https://www.iconfinder.com/icons/106223/play_icon

const PlayIcon: React.FunctionComponent<React.HTMLAttributes<SVGElement>> = (
  props,
) => {
  return (
    <svg viewBox="0 0 512 512" {...props}>
      <path
        fill="currentColor"
        d="M256,512C114.625,512,0,397.375,0,256C0,114.609,114.625,0,256,0s256,114.609,256,256C512,397.375,397.375,512,256,512z   M256,64C149.969,64,64,149.969,64,256s85.969,192,192,192c106.03,0,192-85.969,192-192S362.031,64,256,64z M192,160l160,96l-160,96  V160z"
      />
    </svg>
  );
};

const WrappedPlayIcon = React.memo(PlayIcon);
export { WrappedPlayIcon as PlayIcon };
