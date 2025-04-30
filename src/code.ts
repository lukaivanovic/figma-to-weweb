import { parse } from './generate/parse'
import { loadConfig, updateConfig } from './generate/helpers/config'
import { tag } from './generate/helpers/tagging'
import { key } from './generate/helpers/beta'
import { exportStyles } from './exportStyles/main'
import convertGroup from './generate/helpers/convertGroups'
import addAutoLayout from './generate/helpers/addAutoLayout'
import { addImage } from './generate/parse'

figma.showUI(__html__, { themeColors: true, height: 370, width: 260 })
  ; (async () => {
    selectionChange()

    figma.on('selectionchange', selectionChange)
  })()

// Traverse selection
async function main() {
  const selection = figma.currentPage.selection

  if (selection.length === 0) {
    figma.notify('Please select at least one layer.')
  } else {
    const result = await countNodes(selection[0])
    if (result.type) {
      await parse(selection)
      figma.notify('Generation successful. Paste in WeWeb.')
    } else {
      figma.notify('Too many layers.')
    }
  }
}

figma.ui.on('message', async ({ type, payload }) => {
  switch (type) {
    case 'config':
      return
    case 'tag':
      tag(payload)
      return
    case 'export':
      return main()
    case 'styles':
      return exportStyles(payload)
    case 'group':
      await convertGroup()
      selectionChange()
      break
    case 'auto-layout':
      await addAutoLayout()
      selectionChange()
      break
    case 'image-return':
      addImage(payload)
      break
  }
})

async function onMessage(type, payload) {
  switch (type) {
    case 'config':
      return
    case 'tag':
      tag(payload)
      return
    case 'export':
      updateConfig(payload)
      if (payload === key) {
        return main()
      } else {
        figma.notify('Invalid key')
      }
    case 'styles':
      return exportStyles(payload)
    case 'group':
      await convertGroup()
      selectionChange()
      break
    case 'auto-layout':
      await addAutoLayout()
      selectionChange()
      break
    case 'image-return':
      addImage(payload)
      break
  }
}

async function selectionChange() {
  const selection = figma.currentPage.selection

  if (selection.length === 0 || selection[0].type !== 'FRAME') {
    figma.ui.postMessage({
      type: 'selection-change',
      payload: {
        allowGeneration: false,
        message: 'Please select a frame to export.',
        elementName: 'None',
        tag: 'none',
        autoLayoutNumber: 'None',
        groupNumber: 'None',
      },
    })
  } else {
    const nodeTag = selection[0].getRelaunchData().tag
    const result = await countNodes(selection[0])

    figma.ui.postMessage({
      type: 'selection-change',
      payload: {
        allowGeneration: result.type,
        message: result.type
          ? `Selected: ${selection[0].name}`
          : result.message,
        elementName: `${selection[0].name}`,
        tag: nodeTag === undefined ? 'none' : nodeTag,
        autoLayoutNumber: result.autoLayoutNumber,
        groupNumber: result.groupNumber,
      },
    })
  }
}

async function countNodes(selection) {
  let nodeCount = 0
  let autoLayoutFrames = 0
  let numOfFrames = 0
  let numOfGroups = 0

  await traverse(selection)

  async function traverse(selection) {
    if ('children' in selection) {
      for (const child of selection.children) {
        if (child.visible) {
          nodeCount++

          // console.log(child.getRelaunchData().hasOwnProperty("tag"));
          if (!child.getRelaunchData().hasOwnProperty('tag')) {
            /* if (child.type === "GROUP" && includesGroups === false) {
            includesGroups = true;
          }
          */
            if (child.type === 'GROUP') {
              numOfFrames++
              numOfGroups++
            }
            if (child.type === 'FRAME') {
              numOfFrames++
              if (child.layoutMode !== 'NONE') {
                autoLayoutFrames++
              }
            }
            await traverse(child)
          }
        }
      }
    }
  }

  const autoLayoutPercentage = autoLayoutFrames / numOfFrames
  const groupPercentage = numOfGroups / nodeCount

  if (nodeCount > 240) {
    return {
      type: false,
      message: 'Too many nodes selected.',
      autoLayoutNumber: autoLayoutFrames,
      groupNumber: numOfGroups,
    }
  } else if (autoLayoutPercentage < 0.7 && numOfFrames > 7) {
    return {
      type: false,
      message: 'Not enough frames are using auto layout.',
      autoLayoutNumber: autoLayoutFrames,
      groupNumber: numOfGroups,
    }
  } else if (groupPercentage > 0.2) {
    return {
      type: false,
      message: 'Too many groups used. Convert them to frames with auto layout.',
      autoLayoutNumber: autoLayoutFrames,
      groupNumber: numOfGroups,
    }
  } else {
    return {
      type: true,
      message: '',
      autoLayoutNumber: autoLayoutFrames,
      groupNumber: numOfGroups,
    }
  }
}
