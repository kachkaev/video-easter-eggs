// Two functions below are by antimatter15. Source:
// https://github.com/antimatter15/rgb-lab/blob/a6cf2e9e2ff6fcc7965a2e73c019f8ace69b4384/color.js#L1

const rgb2lab = (rgb) => {
  let r = rgb[0] / 255,
    g = rgb[1] / 255,
    b = rgb[2] / 255,
    x,
    y,
    z;

  r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
  g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
  b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;

  x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
  y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.0;
  z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;

  x = x > 0.008856 ? Math.pow(x, 1 / 3) : 7.787 * x + 16 / 116;
  y = y > 0.008856 ? Math.pow(y, 1 / 3) : 7.787 * y + 16 / 116;
  z = z > 0.008856 ? Math.pow(z, 1 / 3) : 7.787 * z + 16 / 116;

  return [116 * y - 16, 500 * (x - y), 200 * (y - z)];
};

// calculate the perceptual distance between colors in CIELAB
// https://github.com/THEjoezack/ColorMine/blob/master/ColorMine/ColorSpaces/Comparisons/Cie94Comparison.cs

const deltaE = (labA, labB) => {
  const deltaL = labA[0] - labB[0];
  const deltaA = labA[1] - labB[1];
  const deltaB = labA[2] - labB[2];
  const c1 = Math.sqrt(labA[1] * labA[1] + labA[2] * labA[2]);
  const c2 = Math.sqrt(labB[1] * labB[1] + labB[2] * labB[2]);
  const deltaC = c1 - c2;
  let deltaH = deltaA * deltaA + deltaB * deltaB - deltaC * deltaC;
  deltaH = deltaH < 0 ? 0 : Math.sqrt(deltaH);
  const sc = 1.0 + 0.045 * c1;
  const sh = 1.0 + 0.015 * c1;
  const deltaLklsl = deltaL / 1.0;
  const deltaCkcsc = deltaC / sc;
  const deltaHkhsh = deltaH / sh;
  const i =
    deltaLklsl * deltaLklsl + deltaCkcsc * deltaCkcsc + deltaHkhsh * deltaHkhsh;

  return i < 0 ? 0 : Math.sqrt(i);
};

const hex2rgb = (hexColor: string): number[] => {
  const rgb: number[] = [];
  for (let channel = 0; channel < 3; channel += 1) {
    rgb.push(parseInt(hexColor.slice(channel * 2, channel * 2 + 2), 16));
  }

  return rgb;
};

const rgb2hex = (rgb: number[]): string => {
  return rgb.map((value) => value.toString(16).padStart(2, "0")).join("");
};

export const extractHexColorDelta = (
  hexColor1: string,
  hexColor2: string,
): string => {
  const lab1 = rgb2lab(hex2rgb(hexColor1));
  const lab2 = rgb2lab(hex2rgb(hexColor2));
  const delta = Math.max(deltaE(lab1, lab2), deltaE(lab2, lab1));
  const channelValue = 255 - Math.floor(Math.min(delta * 10, 255));

  return rgb2hex([channelValue, channelValue, channelValue]);
};
