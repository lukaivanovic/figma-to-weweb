import { color, colorGen, componentToHex } from "./helpers/color";

export function styleText(node) {
  let style = `font-size: ${node.fontSize}px; margin-block-start: 0px; margin-block-end: 0px;`;

  if (node.fills.length > 0) {
    style += `color: ${colorGen(node.fills[0].color)} `;
  }

  return style;
}

export function styleFrame(node) {
  let style = "";

  if (node.layoutMode !== "NONE") {
    style += "display: flex; ";
  } else {
    style += "display: block; ";
    //style += "height: auto !important; ";
  }

  if (node.layoutGrow == 1 || node.layoutAlign === "STRETCH") {
    style += "width: 100% !important; ";
  }

  if (node.layoutMode === "VERTICAL") {
    style += "flex-direction: column; ";
    style += `row-gap: ${node.itemSpacing}px; `;
  } else if (node.layoutMode === "HORIZONTAL") {
    style += "flex-direction: row; ";
    if (node.primaryAxisAlignItems != "SPACE_BETWEEN") {
      style += `column-gap: ${node.itemSpacing}px; `;
    }
  }

  if (
    node.primaryAxisAlignItems === "SPACE_BETWEEN" ||
    node.counterAxisAlignItems === "SPACE_BETWEEN"
  ) {
    style += "justify-content: space-between;";
  }

  if (node.layoutMode != "NONE") {
    if (node.primaryAxisSizingMode === "FIXED") {
      node.layoutMode === "HORIZONTAL"
        ? (style += `width: ${node.width}px; `)
        : (style += `height: ${node.height}px; `);
    }

    if (node.counterAxisSizingMode === "FIXED") {
      node.layoutMode === "HORIZONTAL"
        ? (style += `height: ${node.height}px; `)
        : (style += `width: ${node.width}px; `);
    }

    style += padding(node);
    /*
    if (
      node.primaryAxisSizingMode != "FIXED" ||
      node.counterAxisSizingMode != "FIXED"
    ) {
      style += padding(node);
    }
    */
  } else {
    style += `width: ${node.width}px; `;
    style += `height: ${node.height}px; `;
  }

  if (node.parent.layoutMode === "NONE") {
    style += `width: ${node.width}px; `;
    style += `height: ${node.height}px; `;
  }

  if (node.layoutMode != "NONE") {
    if (node.primaryAxisAlignItems === "MIN") {
      style += "justify-content: flex-start; ";
    } else if (node.primaryAxisAlignItems === "CENTER") {
      style += "justify-content: center; ";
    } else if (node.primaryAxisAlignItems === "MAX") {
      style += "justify-content: flex-end; ";
    }

    if (node.counterAxisAlignItems === "MIN") {
      style += "align-items: flex-start; ";
    } else if (node.counterAxisAlignItems === "CENTER") {
      style += "align-items: center; ";
    } else if (node.counterAxisAlignItems === "MAX") {
      style += "align-items: flex-end; ";
    }
  }

  if (node.fills.length > 0) {
    style += color(node);
  }

  // console.log(color(node));

  if (node.strokes.length > 0) {
    style += border(node);
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

export function styleEllipse(node) {
  let style = "";

  style += `width: ${node.width}px; `;
  style += `height: ${node.height}px; `;

  if (node.fills.length > 0) {
    if (node.fills[0].visible) {
      style += `background-color: ${colorGen(node.fills[0].color)} `;
    }
  }

  if (node.strokes.length > 0) {
    style += border(node);
  }

  style += `border-radius: 100%; `;

  if (node.effects.length > 0) {
    style += `${shadow(node)}; `;
  }

  return style;
}

function padding(node) {
  return `padding: ${node.paddingTop}px ${node.paddingRight}px ${node.paddingBottom}px ${node.paddingLeft}px; `;
}

function border(node) {
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

    return `border: ${node.strokeWeight}px solid ${color} `;
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
      ? (borders += `border-top: ${node.strokeTopWeight}px solid ${color} `)
      : "";
    node.strokeBottomWeight !== 0
      ? (borders += `border-bottom: ${node.strokeBottomWeight}px solid ${color} `)
      : "";
    node.strokeRightWeight !== 0
      ? (borders += `border-right: ${node.strokeRightWeight}px solid ${color} `)
      : "";
    node.strokeLeftWeight !== 0
      ? (borders += `border-left: ${node.strokeLeftWeight}px solid ${color} `)
      : "";

    return borders;
  }
}

function shadow(node) {
  var combinedShadows = "box-shadow: ";

  for (const effect of node.effects) {
    if (effect.type === "DROP_SHADOW") {
      combinedShadows += `${effect.offset.x}px ${effect.offset.y}px ${effect.radius}px rgba(${effect.color.r}, ${effect.color.g}, ${effect.color.b}, ${effect.color.a}),`;
    }
  }
  combinedShadows = combinedShadows.slice(0, -1);
  return combinedShadows;
}

function borderRadius(node) {
  if (node.cornerRadius !== figma.mixed) {
    return `border-radius: ${node.cornerRadius}px; `;
  } else {
    return `border-radius: ${node.topLeftRadius}px ${node.topRightRadius}px ${node.bottomRightRadius}px ${node.bottomLeftRadius}px; `;
  }
}
