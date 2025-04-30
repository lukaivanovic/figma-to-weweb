export default async function addAutoLayout() {
  const selection = figma.currentPage.selection;

  await traverse(selection[0]);

  async function traverse(selection) {
    if ("children" in selection) {
      for (const child of selection.children) {
        if (child.visible) {
          if (!child.getRelaunchData().hasOwnProperty("tag")) {
            if (child.type === "FRAME") {
              if (child.inferredAutoLayout != null) {
                console.log(child.inferredAutoLayout.itemSpacing);
                const inferred = child.inferredAutoLayout;
                child.layoutMode = inferred.layoutMode;
                child.itemSpacing = inferred.itemSpacing;
              } else {
                child.layoutMode = "HORIZONTAL";
              }
              traverse(child);
            }
          }
        }
      }
    }
  }
}
