import { RgbToHex } from '../generate/style/helpers/color'

export function exportStyles(type) {
  switch (type) {
    case 'Colors':
      figma.notify('Generating...')
      exportColors()
      figma.notify('Generation complete. Paste into WeWeb')
      break
    case 'Typography':
      figma.notify('Generating...')
      exportTypography()
      figma.notify('Generation complete. Paste into WeWeb')
      break
  }
}

function exportColors() {
  const styles = figma.getLocalPaintStyles()

  let output: Array<object> = []

  styles.forEach((style) => {
    const styleName = style.name.split('/')
    if (style.paints[0].type === 'SOLID') {
      const color = {
        type: 'color',
        name: style.name,
        value: RgbToHex(style.paints[0].color),
      }

      output.push(color)
    }
  })

  figma.ui.postMessage({
    type: 'styles',
    payload: JSON.stringify(output, null, 4),
  })
}

function exportTypography() {
  const styles = figma.getLocalTextStyles()

  let output: Array<object> = []

  styles.forEach((style) => {
    if (style.lineHeight.unit !== 'PIXELS') {
      const textStyle = {
        type: 'typo',
        name: style.name,
        fontSize: style.fontSize + 'px',
        fontWeight: style.fontName.style,
      }
      output.push(textStyle)
    } else {
      const textStyle = {
        type: 'typo',
        name: style.name,
        fontSize: style.fontSize + 'px',
        lineHeight: style.lineHeight.value + 'px',
        fontWeight: style.fontName.style,
      }
      output.push(textStyle)
    }
  })

  figma.ui.postMessage({
    type: 'styles',
    payload: JSON.stringify(output, null, 4),
  })
}
