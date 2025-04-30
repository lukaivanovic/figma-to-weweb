import { RgbToHex, resolvePaint } from './color'

export function borders(node) {
  if (node.strokeWeight !== figma.mixed) {
    let color: any

    if (node.strokes[0].type === 'SOLID') {
      // color = colorGen(node.strokes[0].color)
      color = resolvePaint(node.strokes[0])
    } else if (node.strokes[0].type === 'IMAGE') {
    } else {
      color = RgbToHex(node.fills[0].gradientStops[0].color)
    }

    return {
      border: `${node.strokeWeight}px solid ${color}`,
      borderWidth: `${node.strokeWeight}px`,
      borderColor: color,
      borderStyle: 'solid',
    }
  } else {
    var borders: any = {}
    let color: any

    if (node.strokes[0].type === 'SOLID') {
      color = resolvePaint(node.strokes[0])
    } else if (node.strokes[0].type === 'IMAGE') {
    } else {
      color = resolvePaint(node.fills[0].gradientStops[0])
    }

    borders.borderColor = color
    borders.borderStyle = 'solid'

    if (node.strokeTopWeight && node.strokeTopWeight !== 0) {
      borders.borderTop = `${node.strokeTopWeight}px solid ${color}`
      borders.borderTopWidth = `${node.strokeTopWeight}px`
    } else {
      borders.borderTop = '0px'
    }
    if (node.strokeBottomWeight && node.strokeBottomWeight !== 0) {
      borders.borderBottom = `${node.strokeBottomWeight}px solid ${color}`
      borders.borderBottomWidth = `${node.strokeBottomWeight}px`
    } else {
      borders.borderBottom = '0px'
    }
    if (node.strokeLeftWeight && node.strokeLeftWeight !== 0) {
      borders.borderLeft = `${node.strokeLeftWeight}px solid ${color}`
      borders.borderLeftWidth = `${node.strokeLeftWeight}px`
    } else {
      borders.borderLeft = '0px'
    }
    if (node.strokeRightWeight && node.strokeRightWeight !== 0) {
      borders.borderRight = `${node.strokeRightWeight}px solid ${color}`
      borders.borderRightWidth = `${node.strokeRightWeight}px`
    } else {
      borders.borderRight = '0px'
    }

    return borders
  }
}
