import { styleText, styleFrame, styleEllipse } from "./style";
import { color, colorGen, componentToHex } from "./helpers/color";

let output = "";

export async function parse(selection) {
  output = "";

  for (const node of selection) {
    await traverse(node);
  }

  figma.ui.postMessage({ type: "export", payload: output });
  figma.notify("Generation complete. Paste in WeWeb.");
}

async function traverse(node) {
  if (!node.visible) {
    return;
  }

  switch (node.type) {
    case "FRAME":
    case "INSTANCE":
    case "COMPONENT": {
      if (await resolveIcon(node)) {
        return;
      }

      switch (node.getRelaunchData().tag) {
        case "Button": {
          const css = styleFrame(node);
          output += `\n<button style="${css}">Click me</button>`;
          return;
        }

        case "Input": {
          const css = styleFrame(node);
          output += `\n<input style="${css}"></input>`;
          return;
        }

        default: {
          const css = styleFrame(node);
          output += `\n<div style="${css}">`;

          if (
            node.fills.length > 0 &&
            node.fills !== figma.mixed &&
            node.fills[0].type === "IMAGE"
          ) {
            output += `<img src="https://cdn.weweb.app/public/images/no_image_selected.png" style="width: 100%; fill: cover; height: 100%"></img>`;
          }
          break;
        }
      }
      break;
    }

    case "TEXT": {
      const css = styleText(node);
      output += `\n<p style="${css}">${node.characters}</p>`;
      break;
    }

    case "RECTANGLE": {
      if (resolveImage(node)) {
        output += `<img src="https://cdn.weweb.app/public/images/no_image_selected.png" style="width: 100%; fill: cover; height: ${node.height}px"></img>`;
      }
      break;
    }

    case "LINE": {
      output += `<div style="width: 100%; height: ${
        node.strokeWeight
      }px; background-color: ${colorGen(node.strokes[0].color)}"></div>`;
      break;
    }
  }

  // Traverse the node
  if ("children" in node) {
    for (const child of node.children) {
      await traverse(child);
    }
  }

  // Close the div tag if applicable
  if (node.type === "FRAME" || node.type === "INSTANCE") {
    output += "\n</div>";
  }
}

async function resolveIcon(node) {
  // if all nodes are vectors and the size is smaller than 64px -> icon
  // if the size is larger than 64px and any of the nodes are vectors -> do the parent div and ignore the children

  if (node.children.length != 0) {
    for (const child of node.children) {
      if (child.type !== "VECTOR") {
        return false;
      }
    }
    if (node.width > 64 && node.height > 64) {
      const css = styleFrame(node);
      output += `\n<div style="${css}">`;
    } else {
      output += `<img tag="icon" style="width: ${node.width}px; height: ${node.height}px;" src="https://cdn.weweb.io/public/images/sun.svg" />`;
    }
    return true;

    // const bytes = await node.exportAsync({ format: "SVG" });
    // const svg = decodeA(bytes);
  }
}

function resolveImage(node) {
  if (node.fills !== figma.mixed && node.fills[0].type === "IMAGE") {
    return true;
  }
}
