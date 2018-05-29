
let palette = [
  'Blue',
  'LightSeaGreen',
  'Gold',
  'Brown',
  'Cyan',
  'Coral',
  'Crimson'
]
let paletteNum = 4

function setPaletteNum(num) {
  if (num > palette.length) {
    return false
  }
  paletteNum = num
}

function getRndColor() {
  return palette[Math.floor(Math.random() * (paletteNum))]
}

export {setPaletteNum, getRndColor}
