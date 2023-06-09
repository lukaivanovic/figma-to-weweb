export function tag(type) {
  const selection = figma.currentPage.selection[0];

  switch (type) {
    case "button":
      selection.setRelaunchData({ tag: "Button" });
      break;
    case "input":
      selection.setRelaunchData({ tag: "Input" });
      break;
  }
}
