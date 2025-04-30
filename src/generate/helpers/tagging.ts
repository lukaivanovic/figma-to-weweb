export function tag(type) {
  const selection = figma.currentPage.selection;

  if (type !== "") {
    selection.forEach((node) => {
      node.setRelaunchData({ tag: type });
    });
  } else {
    selection.forEach((node) => {
      node.setRelaunchData({});
    });
  }
}
