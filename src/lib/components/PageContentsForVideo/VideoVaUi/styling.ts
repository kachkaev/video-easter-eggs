const customMediaQuery = (maxWidth: number) =>
  `@media (max-width: ${maxWidth}px)`;

export const mobileMedia = customMediaQuery(800);
export const timeFormat = "hh:mm:ss.SSS";
export const shortTimeFormat = "hh:mm:ss";
