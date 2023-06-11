import { color, colorGen, componentToHex } from "../helpers/color";
import { borders } from "../helpers/borders";
import { shadow } from "../helpers/shadows";
import { layout } from "../helpers/layout";

export function styleFrame(node) {
  let style = "";

  style += layout(node);

  if (
    node.fills.length > 0 &&
    (node.fills[0].type === "SOLID" || node.fills[0].type === "GRADIENT_LINEAR")
  ) {
    style += color(node);
  }

  if (node.strokes.length > 0) {
    style += borders(node);
  }

  style += borderRadius(node);

  if (node.effects.length > 0) {
    style += `${shadow(node)}; `;
  }

  if (node.clipsContent) {
    style += "overflow: hidden; ";
  }

  return style;
}

function padding(node) {
  return `padding: ${node.paddingTop}px ${node.paddingRight}px ${node.paddingBottom}px ${node.paddingLeft}px; `;
}

function borderRadius(node) {
  if (node.cornerRadius !== figma.mixed) {
    return `border-radius: ${node.cornerRadius}px; `;
  } else {
    return `border-radius: ${node.topLeftRadius}px ${node.topRightRadius}px ${node.bottomRightRadius}px ${node.bottomLeftRadius}px; `;
  }
}
