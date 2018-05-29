import Block from './block'
import Controller from './controller'
import {
  setPaletteNum,
  getRndColor
} from './color'

let boardW = 4
let boardH = 6

let glass = []

let scoreCounter = ''
let scoreLabel = document.getElementById('score-label')

const loadBoard = () => {
  setPaletteNum(4)
  scoreCounter = 0
  for (let y = 0; y < boardH; y++) {
    glass[y] = []
    for (let x = 0; x < boardW; x++) {
      let id = `b${x}${y}`

      let b = new Block(id, x, y, getRndColor())
      glass[y].push(b)
    }
    console.log('')
  }

  window.addEventListener('swipe', onSwipe)

  checkLines()
}


const onSwipe = (event) => {
  if (event.myTarget.className !== 'block') {
    return
  }

  let b = findBlockByElement(event.myTarget)
  if (!b.active) {
    return
  }
  let dir = event.dir
  if (checkShift(b.x, b.y, dir)) {
    let sb = getSecondBlock(b, dir)

    b.shift(dir)
    sb.shift(reverseDir(dir))
    
    swap(b, sb, dir)
    applyPos()
    checkLines()
  }
}


const findBlockByElement = (e) => {
  for (let bs of glass) {
    for (let b of bs) {
      if (b.element.id === e.id) {
        return b
      }
    }
  }
}


const checkShift = (x, y, dir) => {
  // let x = b.x
  // let y = b.y
  let res = true

  switch (dir) {
    case 'up':
      if (y === 0) {
        res = false
      }
      break
    case 'right':
      if (x === boardW - 1) {
        res = false
      }
      break
    case 'down':
      if (y === boardH - 1) {
        res = false
      }
      break
    case 'left':
      if (x === 0) {
        res = false
      }
      break
  }
  return res
}


const getSecondBlock = (b, dir) => {
  let sb
  switch (dir) {
    case 'up':
      sb = findBlockByPos(b.x, b.y - 1)
      break
    case 'right':
      sb = findBlockByPos(b.x + 1, b.y)
      break
    case 'down':
      sb = findBlockByPos(b.x, b.y + 1)
      break
    case 'left':
      sb = findBlockByPos(b.x - 1, b.y)
      break
  }
  return sb
}


const findBlockByPos = (x, y) => {
  for (let bs of glass) {
    for (let b of bs) {
      if (b.x === x && b.y === y) {
        return b
      }
    }
  }
}


const reverseDir = (dir) => {
  let revers
  switch (dir) {
    case 'up':
      revers = 'down'
      break
    case 'right':
      revers = 'left'
      break
    case 'down':
      revers = 'up'
      break
    case 'left':
      revers = 'right'
      break
  }
  return revers
}


const checkLines = () => {
  let allRemBlock = []
  for (let y = 0; y < boardH; y++) { // поиск линий по горизонтали
    allRemBlock = allRemBlock.concat(checkLineX(y))
  }
  for (let x = 0; x < boardW; x++) { // поиск линий по горизонтали
    arrConcat(allRemBlock, checkLineY(x))
  }

  removeBlocks(allRemBlock)
  glassDrop()
  applyPos()
  spawnBlocks(allRemBlock)
  setScore(scoreCounter + allRemBlock.length)

  if (allRemBlock.length > 0) {
    setTimeout(checkLines, 1000)
  }
}


const checkLineX = (_y) => {
  let num = 0
  let curBlocks = []
  let remBlocks = []
  let prevColor = glass[_y][0].color
  curBlocks[num] = glass[_y][0]
  num++

  for (let x = 1; x < boardW; x++) {

    if (glass[_y][x].color === prevColor) {
      
      curBlocks[num] = glass[_y][x]
      num++
    } else {
      // console.log('Find ' + num + ' Block of ' + prevColor)
      if (num >= 3) {
        remBlocks = remBlocks.concat(curBlocks)
      }
      num = 0
      prevColor = glass[_y][x].color
      curBlocks = []
      curBlocks[num] = glass[_y][x]
      num++
    }
  }
  // console.log('Find ' + num + ' Block of ' + prevColor)
  if (num >= 3) {
    remBlocks = remBlocks.concat(curBlocks)
  }
  return remBlocks
}


const checkLineY = (_x) => {
  let num = 0
  let curBlocks = []
  let remBlocks = []
  let prevColor = glass[0][_x].color
  curBlocks[num] = glass[0][_x]
  num++

  for (let y = 1; y < boardH; y++) {

    if (glass[y][_x].color === prevColor) {
      
      curBlocks[num] = glass[y][_x]
      num++
    } else {
      // console.log('Find ' + num + ' Block of ' + prevColor)
      if (num >= 3) {
        remBlocks = remBlocks.concat(curBlocks)
      }
      num = 0
      prevColor = glass[y][_x].color
      curBlocks = []
      curBlocks[num] = glass[y][_x]
      num++
    }
  }
  // console.log('Find ' + num + ' Block of ' + prevColor)
  if (num >= 3) {
    remBlocks = remBlocks.concat(curBlocks)
  }
  return remBlocks
}


const removeBlocks = (blocks) => {
  for (let b of blocks) {
    b.remove()
  }
}


const spawnBlocks = (blocks) => {
  for (let b of blocks) {
    b.spawn(getRndColor())
  }
}


const glassDrop = () => {
  for (let x = 0; x < boardW; x++) {
    for (let y = 1; y < boardH; y++) {
      if (!glass[y][x].active) {
        while (checkShift(x, y, 'up') && glass[y - 1][x].active) {
          let tmp = glass[y][x]
          glass[y][x] = glass[y - 1][x]
          glass[y - 1][x] = tmp
          y--
        }
      }
    }
  }
}

const swap = (a, b, dir) => {
  //a.shift(dir)
  //b.shift(reverseDir(dir))
  let tmp = glass[a.y][a.x]
  glass[a.y][a.x] = glass[b.y][b.x]
  glass[b.y][b.x] = tmp
}

const applyPos = () => {
  for (let y = 0; y < boardH; y++) {
    for (let x = 0; x < boardW; x++) {
      glass[y][x].setPos(x, y)
    }
  }
}

const arrConcat = (arr1, arr2) => {
  for (let a2 of arr2) {
    if (!checkExist(a2, arr1)) {
      arr1.push(a2)
    }
  }
}

const checkExist = (obj, arr) => {
  for (let a of arr) {
    if (obj === a) {
      return true
    }
  }
  return false
}

const setScore = (n) => {
  scoreCounter = n
  scoreLabel.innerHTML = scoreCounter
}

export default loadBoard
