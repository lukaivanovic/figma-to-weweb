export function color(node) {
  if (node.fills.length > 0) {
    return resolvePaint(node.fills[0])
  }
}

export function fill(node) {
  if (node.fills.length > 0) {
    switch (node.fills[0].type) {
      case 'SOLID':
        return {
          backgroundColor: resolvePaint(node.fills[0])
        }
      case 'GRADIENT_LINEAR':
      case 'GRADIENT_RADIAL':
      case 'GRADIENT_ANGULAR':
      case 'GRADIENT_DIAMOND': {
        return {
          backgroundGradient: resolvePaint(node.fills[0])
        }
      }
    }

  }
}

export function strokes(node) {
  if (node.strokes.length > 0) {
    return resolvePaint(node.strokes[0])
  }
}

export function resolvePaint(paint) {
  if (paint.visible) {
    switch (paint.type) {
      case 'SOLID': {
        if (paint.opacity != 1) {
          const colorOpacity = ((255 * paint.opacity) / 1) | 0
          return RgbToHex(paint.color) + componentToHex(colorOpacity)
        }
        return RgbToHex(paint.color)
      }
      case 'GRADIENT_LINEAR': {
        const colorStops = paint.gradientStops
        let output = `linear-gradient(90deg, `
        colorStops.forEach((element) => {
          const normalizedRGB = normalizeRGB(element.color)
          output += `rgb(${normalizedRGB[0]}, ${normalizedRGB[1]}, ${normalizedRGB[2]}) ${element.position * 100
            }%,`
        })
        output = output.slice(0, -1)
        output += `)`
        return output
      }
      case 'GRADIENT_RADIAL':
      case 'GRADIENT_ANGULAR':
      case 'GRADIENT_DIAMOND': {
        break
      }
      case 'IMAGE': {
        break
      }
    }
  }
}

export function RgbToHex(colorArray) {
  const rN = ((255 * colorArray.r) / 1) | 0
  const gN = ((255 * colorArray.g) / 1) | 0
  const bN = ((255 * colorArray.b) / 1) | 0

  const output =
    '#' + componentToHex(rN) + componentToHex(gN) + componentToHex(bN)

  return output
}

function normalizeRGB(colorArray) {
  const rN = ((255 * colorArray.r) / 1) | 0
  const gN = ((255 * colorArray.g) / 1) | 0
  const bN = ((255 * colorArray.b) / 1) | 0

  return [rN, gN, bN]
}

export function componentToHex(c) {
  var hex = c.toString(16)
  return hex.length == 1 ? '0' + hex : hex
}
