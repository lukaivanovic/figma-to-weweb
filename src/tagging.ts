export function tag(type) {
  const selection = figma.currentPage.selection[0];

  switch (type) {
    case "":
      selection.setRelaunchData({});
      break;
    case "Button":
      selection.setRelaunchData({ tag: "Button" });
      break;
    case "Input":
      selection.setRelaunchData({ tag: "Input" });
      break;
    case "Select":
      selection.setRelaunchData({ tag: "Select" });
      break;
    case "Image":
      selection.setRelaunchData({ tag: "Image" });
      break;
    case "Ignore":
      selection.setRelaunchData({ tag: "Ignore" });
      break;
  }
}
