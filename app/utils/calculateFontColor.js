const perceivedLightnessMap = {};

export const isCachedBackgroundLight = (backgroundColor) =>
  perceivedLightnessMap[backgroundColor] || false;

const calculateFontColor = (element) => {
  if (!element) {
    return;
  }

  const backgroundColorRGB = window.getComputedStyle(element).backgroundColor
    .replace(new RegExp('[^0-9.,]+', 'g'), '')
    .split(',');
  const perceivedBackgroundLightness = (
    0.299 * backgroundColorRGB[0]
      + 0.587 * backgroundColorRGB[1]
      + 0.114 * backgroundColorRGB[2]
  ) / 255;

  perceivedLightnessMap[element.style.backgroundColor] = perceivedBackgroundLightness < 0.5;
  if (perceivedBackgroundLightness < 0.5) {
    // eslint-disable-next-line no-param-reassign
    element.style.color = '#eee';
    // eslint-disable-next-line no-param-reassign
    element.style.borderColor = '#eee';
  }
};

export default calculateFontColor;
