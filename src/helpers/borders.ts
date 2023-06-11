import { color, colorGen, componentToHex } from "./color";

export function borders(node) {
  if (node.strokeWeight !== figma.mixed) {
    var color = "";

    if (node.strokes[0].type === "SOLID") {
      color = colorGen(node.strokes[0].color);
    } else if (node.strokes[0].type === "IMAGE") {
      console.log("Image");
    } else {
      console.log("error");
      color = colorGen(node.fills[0].gradientStops[0].color);
    }

    return `border: ${node.strokeWeight}px solid ${color}; `;
  } else {
    var borders = "";
    var color = "";

    if (node.strokes[0].type === "SOLID") {
      color = colorGen(node.strokes[0].color);
    } else if (node.strokes[0].type === "IMAGE") {
      console.log("Image");
    } else {
      console.log("error");
      color = colorGen(node.fills[0].gradientStops[0].color);
    }

    node.strokeTopWeight !== 0
      ? (borders += `border-top: ${node.strokeTopWeight}px solid ${color}; `)
      : "";
    node.strokeBottomWeight !== 0
      ? (borders += `border-bottom: ${node.strokeBottomWeight}px solid ${color}; `)
      : "";
    node.strokeRightWeight !== 0
      ? (borders += `border-right: ${node.strokeRightWeight}px solid ${color}; `)
      : "";
    node.strokeLeftWeight !== 0
      ? (borders += `border-left: ${node.strokeLeftWeight}px solid ${color}; `)
      : "";

    return borders;
  }
}
