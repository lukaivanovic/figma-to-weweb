import { padding } from './padding'

let wwLayout: any

export function layout(node) {
  let style: any = {}
  wwLayout = {}

  if (node.layoutMode !== 'NONE') {
    style = autoLayoutNode(node)
  } else {
    style.display = 'block'
  }

  switch (node.layoutSizingHorizontal) {
    case 'FIXED':
      style.width = `${node.width}px`
      break
    case 'HUG':
      style.width = 'auto'
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

  switch (node.layoutSizingVertical) {
    case 'FIXED':
      style.height = `${node.height}px`
      break
    case 'HUG':
      style.height = 'auto'
      break
    case 'FILL':
      if (node.parent.layoutMode === 'HORIZONTAL') {
        style.height = `100%`
      } else if (node.parent.layoutMode === 'VERTICAL') {
        style.height = `1`
      }
      break
  }

  if (
    node.parent.layoutMode !== 'NONE' &&
    node.layoutPositioning === 'ABSOLUTE'
  ) {
    Object.assign(style, handleAbsolutePos(node))
  }

  if (node.layoutMode !== 'NONE' || node.parent.layoutMode !== 'NONE') {
    if (node.maxWidth !== null) {
      style.maxWidth = `${node.maxWidth}px`
    }
    if (node.maxHeight !== null) {
      style.maxHeight = `${node.maxHeight}px`
    }
    // style.maxWidth = node.maxWidth != null ? `${node.maxWidth}px` : null
    // style.maxHeight = node.maxHeight != null ? `${node.maxWidth}px` : null
  }

  let computedLayout = {
    '_ww-layout_flexDirection': wwLayout.flexDirection,
    '_ww-layout_rowGap': wwLayout.rowGap,
    '_ww-layout_columnGap': wwLayout.columnGap,
    '_ww-layout_justifyContent': wwLayout.justifyContent,
    '_ww-layout_alignItems': wwLayout.alignItems,
    '_ww-layout_flexWrap': wwLayout.flexWrap,
  }

  return { style: style, layout: computedLayout }
}

function autoLayoutNode(node) {
  let style: any = {}

  style.display = 'flex'

  if (node.layoutMode === 'VERTICAL') {
    wwLayout.flexDirection = 'column'
    wwLayout.rowGap = `${node.itemSpacing}px`
  } else if (node.layoutMode === 'HORIZONTAL') {
    wwLayout.flexDirection = 'row'
    if (node.primaryAxisAlignItems != 'SPACE_BETWEEN') {
      wwLayout.columnGap = `${node.itemSpacing}px`
    }
    if (node.layoutWrap === 'WRAP') {
      wwLayout.flexWrap = 'wrap'
      wwLayout.rowGap = `${node.itemSpacing}px`
    }
  }

  if (
    node.primaryAxisAlignItems === 'SPACE_BETWEEN' ||
    node.counterAxisAlignItems === 'SPACE_BETWEEN'
  ) {
    wwLayout.justifyContent = 'space-between'
  }

  style.padding = padding(node)

  if (node.primaryAxisAlignItems === 'MIN') {
    wwLayout.justifyContent = 'flex-start'
  } else if (node.primaryAxisAlignItems === 'CENTER') {
    wwLayout.justifyContent = 'center'
  } else if (node.primaryAxisAlignItems === 'MAX') {
    wwLayout.justifyContent = 'flex-end'
  }

  if (node.counterAxisAlignItems === 'MIN') {
    wwLayout.alignItems = 'flex-start'
  } else if (node.counterAxisAlignItems === 'CENTER') {
    wwLayout.alignItems = 'center'
  } else if (node.counterAxisAlignItems === 'MAX') {
    wwLayout.alignItems = 'flex-end'
  }

  return style
}

function handleAbsolutePos(node) {
  let style: any = {}

  if (node.constraints.horizontal === 'MAX') {
    style.right = `${node.parent.width - node.x - node.width}`
  } else {
    style.left = `${node.x}`
  }

  if (node.constraints.vertical === 'MAX') {
    style.bottom = `${node.parent.height - node.y - node.height}`
  } else {
    style.top = `${node.y}`
  }

  return style
}
