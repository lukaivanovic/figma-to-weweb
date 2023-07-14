export function borderRadius(node) {
  if (node.cornerRadius !== figma.mixed) {
    return `border-radius: ${node.cornerRadius}px; `;
  } else {
    return `border-radius: ${node.topLeftRadius}px ${node.topRightRadius}px ${node.bottomRightRadius}px ${node.bottomLeftRadius}px; `;
  }
}
