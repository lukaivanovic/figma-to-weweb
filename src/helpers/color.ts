export function color(node) {
  if (node.fills.length > 0) {
    if (node.fills[0].visible) {
      switch (node.fills[0].type) {
        case "SOLID": {
          // console.log(node.fills[0].opacity);
          if (node.fills[0].opacity != 1) {
            // console.log(node.fills[0].opacity);
            const colorOpacity = ((255 * node.fills[0].opacity) / 1) | 0;
            // console.log(componentToHex(colorOpacity));
            return `background-color: ${
              colorGen(node.fills[0].color) + componentToHex(colorOpacity) + ";"
            } `;
          }
          return `background-color: ${colorGen(node.fills[0].color)}; `;
        }
        case "GRADIENT_LINEAR": {
          //     background-image: linear-gradient(90deg, rgb(238, 174, 202) 0%, rgb(148, 187, 233) 100%);
          const colorStops = node.fills[0].gradientStops;
          let output = `background-image: linear-gradient(90deg, `;
          colorStops.forEach((element) => {
            const fixedRGBA = fixRGBA(element.color);
            console.log(element.position);
            output += `rgb(${fixedRGBA[0]}, ${fixedRGBA[1]}, ${fixedRGBA[2]}) ${
              element.position * 100
            }%,`;
          });
          output = output.slice(0, -1);
          output += `); `;
          return output;
        }
        case "GRADIENT_RADIAL":
        case "GRADIENT_ANGULAR":
        case "GRADIENT_DIAMOND": {
          break;
        }
        case "IMAGE": {
          break;
        }
      }
    }
  }
}

export function colorGen(colorArray) {
  const rN = ((255 * colorArray.r) / 1) | 0;
  const gN = ((255 * colorArray.g) / 1) | 0;
  const bN = ((255 * colorArray.b) / 1) | 0;
  // console.log(colorArray.r);
  // console.log(rN);

  const output =
    "#" + componentToHex(rN) + componentToHex(gN) + componentToHex(bN);

  return output;
}

function fixRGBA(colorArray) {
  const rN = ((255 * colorArray.r) / 1) | 0;
  const gN = ((255 * colorArray.g) / 1) | 0;
  const bN = ((255 * colorArray.b) / 1) | 0;

  return [rN, gN, bN];
}

export function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}
