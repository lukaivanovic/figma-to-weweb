import { keys } from "./beta";

export async function loadConfig() {
  const isVerified = await figma.clientStorage.getAsync("isVerified");
  return isVerified;
}

export function updateConfig(betaKey) {
  if (keys.includes(betaKey)) {
    figma.clientStorage.setAsync("isVerified", true);
    figma.ui.postMessage({ type: "verified" });
    figma.ui.resize(320, 320);
  }
}
