const internalColorCache = {};
export const ColorCache = new Proxy(internalColorCache, {
  get(target, name) {
    if (!target[name]) {
      processColoredElement(name);
    }
    return target[name];
  }
});

function rgbToHsl(c) {
  const r = c[0] / 255;
  const g = c[1] / 255;
  const b = c[2] / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h;
  let s;
  const l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    // eslint-disable-next-line default-case
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return [h * 360, s * 100, l * 100];
}

function processColoredElement(color: string, element?: HTMLElement) {
  let guaranteedElement = element;
  let temporaryElement = false;
  if (!element) {
    guaranteedElement = document.createElement('div');
    guaranteedElement.style.backgroundColor = color;
    document.body.appendChild(guaranteedElement);
    temporaryElement = true;
  }
  const rgb = window.getComputedStyle(guaranteedElement).backgroundColor
    .replace(new RegExp('[^0-9.,]+', 'g'), '')
    .split(',');
  const perceivedBackgroundLightness = (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) / 255;
  internalColorCache[color] = {
    rgb,
    hsl: rgbToHsl(rgb),
    isDark: perceivedBackgroundLightness < 0.5
  };
  if (temporaryElement) {
    guaranteedElement.remove();
  }
}

const colorTools = (element) => {
  if (!element) {
    return;
  }

  const color = element.style.backgroundColor;
  processColoredElement(color, element);

  if (ColorCache[color].isDark) {
    // eslint-disable-next-line no-param-reassign
    element.style.color = '#eee';
    // eslint-disable-next-line no-param-reassign
    element.style.borderColor = '#eee';
  }
};

export default colorTools;
