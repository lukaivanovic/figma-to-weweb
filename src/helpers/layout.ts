export function layout(node) {
  let style = "";

  if (node.layoutMode !== "NONE") {
    style += "display: flex; ";
  } else {
    style += "display: block; ";
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

  return style;
}

function padding(node) {
  return `padding: ${node.paddingTop}px ${node.paddingRight}px ${node.paddingBottom}px ${node.paddingLeft}px; `;
}
