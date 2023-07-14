import { color, colorGen, componentToHex } from "../helpers/color";
import { borders } from "../helpers/borders";
import { shadow } from "../helpers/shadows";
import { layout } from "../helpers/layout";

export function text(node) {
  let style = `font-size: ${node.fontSize}px; margin-block-start: 0px; margin-block-end: 0px;`;

  if (node.fills.length > 0) {
    style += `color: ${colorGen(node.fills[0].color)} `;
  }

  return style;
}
