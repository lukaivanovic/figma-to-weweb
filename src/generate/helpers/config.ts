import { key } from "./beta";

export async function loadConfig() {
  const isVerified = await figma.clientStorage.getAsync("key");
  return isVerified;
}

export function updateConfig(betaKey) {
  figma.clientStorage.setAsync("key", betaKey);
}
