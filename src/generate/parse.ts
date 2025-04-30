import { color, RgbToHex, componentToHex } from './style/helpers/color'
import { frame } from './style/frame'
import { text } from './style/text'

let images: Object[] = []

export async function parse(selection) {
  let output: any
  return new Promise((resolve) => {
    for (const node of selection) {
      output = traverse(node)
    }

    figma.ui.postMessage({ type: 'export', payload: JSON.stringify(output) })

    resolve(JSON.stringify(output))
  })
}

function traverse(node) {
  const result = generateElement(node)

  if ('children' in node && !result.end) {
    for (const child of node.children) {
      if (child.visible) {
        if (
          child.type === 'FRAME' ||
          child.type === 'INSTANCE' ||
          child.type === 'COMPONENT' ||
          child.type === 'TEXT'
        ) {
          addChild(result.element, traverse(child))
        }
      }
    }
  }
  // console.log(result)

  return result.element
}

function generateElement(node) {
  const element = makeElement()
  element.name = node.name

  switch (node.type) {
    case 'FRAME':
    case 'INSTANCE':
    case 'COMPONENT': {
      if (node.getRelaunchData().tag === 'ICON' || resolveIcon(node)) {
        element.wwObjectBaseId = '83d890fb-84f9-4386-b459-fb4be89a8e15'
        element.content.default.fontSize = node.width
        return { element: element, end: true }
      } else {
        switch (node.getRelaunchData().tag) {
          case 'Button': {
            let buttonText = 'Click me'

            for (const child of node.children) {
              if (child.type === 'TEXT') {
                const wwText = text(child).wwText

                Object.assign(element.content.default, wwText)
                buttonText = child.characters

                break
              }
            }

            element.wwObjectBaseId =
              '6f8796b1-8273-498d-95fc-7013b7c63214' /* BUTTON */
            element.content.default['_ww-text_text'] = {
              en: buttonText,
            }
            const style = frame(node)
            // console.log(frame(node))
            element._state.style.default = style.style
            element._state.style.default.cursor = 'pointer'

            return { element: element, end: true }
          }
          case 'Input': {
            element.wwObjectBaseId = 'aeb78b9a-6fb6-4c49-931d-faedcfad67ba'

            const style = frame(node)
            element._state.style.default = style.style
            element.content.default.placeholder = { en: 'Input' }

            for (const child of node.children) {
              if (child.type === 'TEXT') {
                element.content.default.placeholder = { en: child.characters }
                Object.assign(element.content.default, text(child).wwText)
                break
              }
            }

            return { element: element, end: true }
          }
          case 'Image': {
            element.wwObjectBaseId =
              '3a7d6379-12d3-4387-98ff-b332bb492a63' /* Image */

            element.content.default.url =
              'https://cdn.weweb.app/public/images/no_image_selected.png'

            element.content.default.loading = 'lazy'

            element.content.default.alt = {
              en: '',
            }

            element.content.default.objectFit = null
            const style = frame(node)
            element._state.style.default = style.style

            return { element: element, end: true }
          }
          default: {
            // getAndLogCSSAsync(node)
            if (node.fills.length > 0) {
              for (const paint of node.fills) {
                if (paint.type === 'IMAGE') {
                  element.wwObjectBaseId =
                    '3a7d6379-12d3-4387-98ff-b332bb492a63' /* Image */

                  element.content.default.url =
                    'https://cdn.weweb.app/public/images/no_image_selected.png'

                  element.content.default.loading = 'lazy'

                  element.content.default.alt = {
                    en: '',
                  }

                  element.content.default.objectFit = null
                  const style = frame(node)
                  element._state.style.default = style.style

                  return { element: element, end: true }
                }
              }
            }

            element.wwObjectBaseId =
              'b783dc65-d528-4f74-8c14-e27c934c39b1' /* Flexbox */
            element.content.default.children = []

            const style = frame(node)
            // console.log(frame(node))
            element._state.style.default = style.style
            Object.assign(element.content.default, style.layout)
            break
          }
        }
      }
      break
    }
    case 'TEXT':
      element.wwObjectBaseId = 'd7904e9d-fc9a-4d80-9e32-728e097879ad'
      element.content.default['_ww-text_text'] = node.characters
      // node.innerText = element.content.default['_ww-text_text'].en
      const style = text(node)
      // console.log(frame(node))
      element._state.style.default = style.style
      Object.assign(element.content.default, style.wwText)
      break
  }

  return { element: element, end: false }
}

function makeElement() {
  const element: any = {
    uid: generateUUID(),
    isWwObject: true,
    version: 4,
    wwObjectBaseId: null,
    content: {
      default: {},
    },
    _state: {
      style: {
        default: {},
      },
    },
  }

  return element
}

function addChild(element, child) {
  if (element.content.default['children'] !== undefined)
    element.content.default['children'].push(child)
}

export function addImage(payload) {
  images.push(payload)
}

function generateUUID() {
  // Public Domain/MIT
  var d = new Date().getTime() //Timestamp
  var d2 =
    (typeof performance !== 'undefined' &&
      performance.now &&
      performance.now() * 1000) ||
    0 //Time in microseconds since page-load or 0 if unsupported
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 //random number between 0 and 16
    if (d > 0) {
      //Use timestamp until depleted
      r = (d + r) % 16 | 0
      d = Math.floor(d / 16)
    } else {
      //Use microseconds since page-load if supported
      r = (d2 + r) % 16 | 0
      d2 = Math.floor(d2 / 16)
    }
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
  })
}

function resolveIcon(node) {
  // if all nodes are vectors and the size is smaller than 64px -> icon
  // if the size is larger than 64px and any of the nodes are vectors -> do the parent div and ignore the children
  let vectorCount = 0
  let nodeCount = 0

  if (node.width < 64 && node.height < 64) {
    if (node.children.length != 0) {
      for (const child of node.children) {
        nodeCount++
        if (child.type === 'VECTOR') {
          vectorCount++
        }
      }
    }

    const vectorToNode = vectorCount / nodeCount

    if (vectorToNode >= 0.5) {
      return true
    } else {
      return false
    }

    // const bytes = await node.exportAsync({ format: "SVG" });
    // const svg = decodeA(bytes);
  }
}

async function getAndLogCSSAsync(node) {
  try {
    const cssStyle = await node.getCSSAsync()
    console.log(cssStyle)
  } catch (error) {
    console.error('Error:')
  }
}
