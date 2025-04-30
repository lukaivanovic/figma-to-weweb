export default async function convertGroup() {
  const selection = figma.currentPage.selection;

  await traverse(selection[0]);

  async function traverse(selection) {
    if ("children" in selection) {
      for (const child of selection.children) {
        if (child.visible) {
          if (!child.getRelaunchData().hasOwnProperty("tag")) {
            if (child.type === "GROUP") {
              const newChild = await convert(child);
              await traverse(newChild);
            } else if (child.type === "RECTANGLE") {
              handleRect(child);
            } else {
              await traverse(child);
            }
          }
        }
      }
    }
  }

  if (!selection[0].getRelaunchData().hasOwnProperty("tag")) {
    if (selection[0].type === "GROUP") {
      const newChild = await convert(selection[0]);
    } else if (selection[0].type === "RECTANGLE") {
      handleRect(selection[0]);
    }
  }
}

async function handleRect(node) {
  figma.group([node], node.parent);

  const frame = await figma.createFrame();
  await node.parent.appendChild(frame);

  frame.resize(node.width, node.height);

  frame.fills = node.fills;
  if (frame.parent !== null) {
    if (frame.parent.type === "FRAME") {
      if (frame.parent.layoutMode !== "NONE") {
        frame.layoutGrow = node.layoutGrow;
        frame.layoutAlign = node.layoutAlign;

        frame.layoutGrow == 0 ? frame.resize(node.width, frame.height) : null;
        frame.layoutAlign == "STRETCH"
          ? frame.resize(frame.width, node.height)
          : null;
      }
    }

    frame.parent.type === "GROUP" ? figma.ungroup(frame.parent) : null;
    node.remove();
  }

  // figma.group(node, node.parent);
}

async function convert(node) {
  const frame = await figma.createFrame();

  frame.x = node.x;
  frame.y = node.y;
  frame.resizeWithoutConstraints(node.width, node.height);

  await node.appendChild(frame);
  await traverse();

  async function traverse() {
    for (const child of node.children) {
      if (child.id != frame.id) {
        child.x -= frame.x;
        child.y -= frame.y;
        await frame.appendChild(child);
      }
    }
  }

  figma.ungroup(node);

  return frame;
}
