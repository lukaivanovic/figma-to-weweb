import { parse } from "./parse";
import { loadConfig, updateConfig } from "./config";
import { tag } from "./tagging";
import { key } from "./beta";

let isVerified;
let nodeCount = 0;

figma.showUI(__html__, { themeColors: true, height: 220, width: 264 });

(async () => {
  figma.ui.postMessage({
    type: "verified",
    payload: await loadConfig(),
  });
  /*
  if (isVerified === true) {
    figma.ui.postMessage({ type: "verified" });
    figma.ui.resize(264, 220);
  }
  */

  selectionChange();

  figma.on("selectionchange", selectionChange);
})();

// Traverse selection
async function main() {
  const selection = figma.currentPage.selection;

  if (selection.length === 0) {
    figma.notify("Please select at least one layer.");
  } else {
    nodeCount = 0;
    if (await countNodes(selection[0])) {
      parse(selection);
    } else {
      figma.notify("Too many layers.");
    }
  }
}

async function countNodes(selection) {
  if ("children" in selection) {
    for (const child of selection.children) {
      nodeCount++;
      if (child.getRelaunchData().tag != "Ignore") {
        await countNodes(child);
      }
    }
  }
  return nodeCount > 200 ? false : true;
}

figma.ui.on("message", ({ type, payload }) => {
  switch (type) {
    case "config":
      return;
    case "tag":
      tag(payload);
      return;
    case "export":
      updateConfig(payload);
      if (payload === key) {
        return main();
      } else {
        figma.notify("Invalid key");
      }
  }
});

async function selectionChange() {
  const selection = figma.currentPage.selection;

  if (selection.length === 0) {
    figma.ui.postMessage({
      type: "error",
      payload: { code: "NO_SELECTION", message: "Nothing is selected." },
    });
    figma.ui.postMessage({
      type: "tag",
      payload: "none",
    });
  } else {
    const nodeTag = selection[0].getRelaunchData().tag;

    if (nodeTag === undefined) {
      figma.ui.postMessage({
        type: "tag",
        payload: "none",
      });
    } else {
      figma.ui.postMessage({
        type: "tag",
        payload: nodeTag,
      });
    }

    nodeCount = 0;
    if (await countNodes(selection[0])) {
      figma.ui.postMessage({
        type: "ok",
        payload: `Selected: ${selection[0].name}`,
      });
    } else {
      figma.ui.postMessage({
        type: "error",
        payload: { code: "TOO_MANY", message: "Too many nodes selected." },
      });
    }
  }
}
