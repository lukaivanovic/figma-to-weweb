import { padding } from "../helpers/padding";

export function layout(node) {
  let style = "";

  if (node.layoutMode !== "NONE") {
    style += autoLayoutNode(node);
  } else {
    style += "display: block; ";

    style += `width: ${node.width}px; `;
    style += `height: ${node.height}px; `;
  }

  if (node.parent.layoutMode === "NONE") {
    style += `width: ${node.width}px; `;
    style += `height: ${node.height}px; `;
  } else {
    if (node.layoutPositioning === "ABSOLUTE") {
      style += "position: absolute; ";
      if (node.constraints.horizontal === "MAX") {
        style += `right:${node.parent.width - node.x - node.width}px; `;
      } else {
        style += `left:${node.x}px; `;
      }

      if (node.constraints.vertical === "MAX") {
        style += `bottom:${node.parent.height - node.y - node.height}px; `;
      } else {
        style += `top:${node.y}px; `;
      }
    }
  }
  if (node.layoutGrow == 1 || node.layoutAlign === "STRETCH") {
    style += "width: 100% !important; ";
  }

  return style;
}

function autoLayoutNode(node) {
  let style = "";

  style += "display: flex; ";

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

  if (node.primaryAxisSizingMode === "FIXED") {
    if (node.layoutMode === "HORIZONTAL") {
      style += `width: ${node.width}px; `;
    } else {
      style += `height: ${node.height}px; `;
    }
  }

  if (node.counterAxisSizingMode === "FIXED") {
    if (node.layoutMode === "HORIZONTAL") {
      style += `height: ${node.height}px; `;
    } else {
      style += `width: ${node.width}px; `;
    }

    style += padding(node);
  }

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

  return style;
}
