type ColorComponents = [number, number, number]
const internalColorCache: {
  [color: string]: {
    rgb: ColorComponents
    hsl: ColorComponents
    isDark: boolean
  }
} = {}

function rgbToHsl(rgbColor: ColorComponents): ColorComponents {
  const r = rgbColor[0] / 255
  const g = rgbColor[1] / 255
  const b = rgbColor[2] / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h
  let s
  const l = (max + min) / 2

  if (max === min) {
    h = 0 // achromatic
    s = 0
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    // eslint-disable-next-line default-case
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }
    // @ts-ignore
    h /= 6
  }
  // @ts-ignore
  return [h * 360, s * 100, l * 100]
}

function processColoredElement(color: string, element?: HTMLElement): void {
  let guaranteedElement = element
  let temporaryElement = false
  if (!guaranteedElement) {
    guaranteedElement = document.createElement('div')
    guaranteedElement.style.backgroundColor = color
    document.body.appendChild(guaranteedElement)
    temporaryElement = true
  }
  const rgb = window
    .getComputedStyle(guaranteedElement)
    .backgroundColor.replace(new RegExp('[^0-9.,]+', 'g'), '')
    .split(',')
    .map((colorChannel) => parseInt(colorChannel, 10)) as ColorComponents
  const perceivedBackgroundLightness =
    (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) / 255
  internalColorCache[color] = {
    rgb,
    hsl: rgbToHsl(rgb),
    isDark: perceivedBackgroundLightness < 0.5,
  }
  if (temporaryElement) {
    guaranteedElement.remove()
  }
}

export const ColorCache = new Proxy(internalColorCache, {
  get(target, name: string) {
    if (!target[name]) {
      processColoredElement(name)
    }
    return target[name]
  },
})

const colorTools = (element: HTMLElement | null): void => {
  if (!element) {
    return
  }

  const color = element.style.backgroundColor
  processColoredElement(color, element)

  // eslint-disable-next-line no-param-reassign
  element.style.color = ColorCache[color].isDark ? '#eee' : 'black'
}

export default colorTools
