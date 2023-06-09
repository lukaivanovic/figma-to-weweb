import { parse } from "./parse";
import { loadConfig, updateConfig } from "./config";
import { tag } from "./tagging";

let isVerified;
let nodeCount = 0;

figma.showUI(__html__, { themeColors: true, height: 360, width: 320 });

(async () => {
  isVerified = await loadConfig();
  if (isVerified === true) {
    figma.ui.postMessage({ type: "verified" });
    figma.ui.resize(320, 320);
  }
})();

// Traverse selection
async function main() {
  if (isVerified === true) {
    const selection = figma.currentPage.selection;

    // TODO: Traverse the node and determine if there is more than 100 elements, throw error if there is

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
  } else {
    figma.notify("Invalid key");
  }
}

async function countNodes(selection) {
  if ("children" in selection) {
    // console.log("there are children in the node");
    for (const child of selection.children) {
      nodeCount++;
      await countNodes(child);
    }
  }
  // console.log("node count is" + nodeCount);
  return nodeCount > 332 ? false : true;
}

figma.ui.on("message", ({ type, payload }) => {
  switch (type) {
    case "config":
      updateConfig(payload);
      return;
    case "tag":
      tag(payload);
      return;
    case "export":
      return main();
  }
});
