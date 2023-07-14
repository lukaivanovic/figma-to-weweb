import { color, colorGen, componentToHex } from "../helpers/color";
import { borders } from "../helpers/borders";
import { shadow } from "../helpers/shadows";
import { layout } from "../helpers/layout";
import { borderRadius } from "../helpers/border-radius";

export function frame(node) {
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
