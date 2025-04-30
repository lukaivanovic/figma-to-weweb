export function shadow(node) {
  let shadowExists = false;
  var combinedShadows = "box-shadow: ";

  for (const effect of node.effects) {
    if (effect.type === "DROP_SHADOW") {
      shadowExists = true;
      combinedShadows += `${effect.offset.x}px ${effect.offset.y}px ${effect.radius}px rgba(${effect.color.r}, ${effect.color.g}, ${effect.color.b}, ${effect.color.a}),`;
    }
  }
  combinedShadows = combinedShadows.slice(0, -1);
  return shadowExists ? combinedShadows : "";
}
