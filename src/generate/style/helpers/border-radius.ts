export function borderRadius(node) {
  if (node.cornerRadius !== figma.mixed) {
    return `${node.cornerRadius}px`
  } else {
    return `${node.topLeftRadius}px ${node.topRightRadius}px ${node.bottomRightRadius}px ${node.bottomLeftRadius}px`
  }
}
