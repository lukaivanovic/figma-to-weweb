import { styleText, styleFrame, styleEllipse } from "./style";
// import { TextEncoder, TextDecoder } from "fastestsmallesttextencoderdecoder";
// const encode = new TextEncoder().encode;
// const decode = new TextDecoder().decode;
// import { encode, decode } from "fastestsmallesttextencoderdecoder";
// const decodeA = decode;

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

      // Predetermined elements
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
          // image
          const css = styleFrame(node);
          output += `\n<div style="${css}">`;
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
      /* else {
        const css = styleFrame(node);
        output += `\n<div style="${css}"></div>`;
      }
      */
      break;
    }

    /* case "ELLIPSE": {
      const css = styleEllipse(node);
      output += `\n<div style="${css}"></div>`;
      break;
    }
    */
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
