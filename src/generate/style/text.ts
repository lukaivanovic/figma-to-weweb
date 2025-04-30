import { color, RgbToHex, componentToHex } from './helpers/color'

export function text(node) {
  let style: any = {}

  let wwText: any = {
    tag: 'p',
    '_ww-text_fontSize': `${node.fontSize}px`,
    '_ww-text_fontWeight': `${node.fontWeight}`,
    '_ww-text_textAlign': node.textAlignHorizontal.toLowerCase(),
  }

  let wwLayout: any = {
    tag: 'p',
    '_ww-text_fontSize': `${node.fontSize}px`,
    '_ww-text_fontWeight': `${node.fontWeight}`,
    '_ww-text_textAlign': node.textAlignHorizontal.toLowerCase(),
  }

  switch (node.layoutSizingHorizontal) {
    case 'FIXED':
      style.width = `${node.width}px`
      break
    case 'HUG':
      break
    case 'FILL':
      if (node.parent.layoutMode === 'VERTICAL') {
        style.width = `100%`
      } else if (node.parent.layoutMode === 'HORIZONTAL') {
        style.flexGrow = `1`
        style.flex = '1'
      }
      break
  }

  if (node.lineHeight.value) {
    node.lineHeight.unit === 'PIXELS'
      ? (wwText['_ww-text_lineHeight'] = node.lineHeight.value + "px")
      : null
  }

  if (node.fills.length > 0) {
    wwText['_ww-text_color'] = `${RgbToHex(node.fills[0].color)}`
  }

  return { style: style, wwText: wwText }
}
