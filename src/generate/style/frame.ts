import { color, RgbToHex, componentToHex, fill, resolvePaint } from './helpers/color'
import { borders } from './helpers/borders'
import { shadow } from './helpers/shadows'
import { layout } from './helpers/layout'
import { borderRadius } from './helpers/border-radius'

export function frame(node) {
  let style: any = {}

  let layoutStyle = layout(node)

  Object.assign(style, layoutStyle.style)

  if (node.strokes.length > 0) {
    Object.assign(style, borders(node))
  }


  Object.assign(style, fill(node))


  style.borderRadius = borderRadius(node)

  if (node.effects.length > 0) {
    let shadowExists = false
    var combinedShadows: string = ''

    for (const effect of node.effects) {
      if (effect.type === 'DROP_SHADOW') {
        shadowExists = true
        const shadowColor = RgbToHex(effect.color)
        const shadowOpacity = componentToHex(((255 * effect.color.a) / 1) | 0)
        combinedShadows += `${effect.offset.x}px ${effect.offset.y}px ${effect.radius}px ${shadowColor + shadowOpacity},`
      }
    }
    if (shadowExists) {
      combinedShadows = combinedShadows.slice(0, -1)
      style.boxShadow = combinedShadows
    }
  }

  if (node.clipsContent) {
    style.overflow = 'hidden'
  }

  return { style: style, layout: layoutStyle.layout }
}
