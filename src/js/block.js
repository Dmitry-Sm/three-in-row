import {TweenMax} from 'gsap'

const offset = 10
let offsetX = 30
let offsetY = 70
let boardOffset = offsetY + 4 * (60 + offset) // ?

class Block {
  constructor (id, x, y, color, w = 60) {
    this.id = id
    this.x = x
    this.y = y
    this.width = w
    this.color = color
    this.active = true

    let element = document.createElement('div')
    this.element = element
    element.className = 'block'
    element.id = 'b-' + x + '' + y
    element.style['background-color'] = color

    let [gx, gy] = this._toGlobalPos(x, y)

    TweenMax.set(element, {
      left: gx + 'px',
      top: gy - boardOffset + 'px'
    })
    TweenMax.to(element, 0.2, {
      top: gy + 'px'
    })
    document.getElementById('board').appendChild(element)
  }

  shift (dir) {
    switch (dir) {
      case 'up':
        this.y--
        break
      case 'right':
        this.x++
        break
      case 'down':
        this.y++
        break
      case 'left':
        this.x--
        break
    }

    let [x, y] = this._toGlobalPos(this.x, this.y)
    
    TweenMax.to(this.element, 0.2, {
      left: x + 'px',
      top: y + 'px'
    })
  }


  setPos (_x, _y) {
    this.x = _x
    this.y = _y
    let [x, y] = this._toGlobalPos(_x, _y)

    TweenMax.to(this.element, 0.4, {
      left: x + 'px',
      top: y + 'px'
    }).delay (0.4)
  }

  remove () {
    TweenMax.to(this.element, 0.2, {
      scale: 0.0
    }).delay (0.2)
    this.active = false
  }

  spawn (color) {
    let [gx, gy] = this._toGlobalPos(this.x, this.y)
    this.active = true
    this.color = color
    //this.element.style['background-color'] = color
    
    // TweenMax.set(this.element, {
    //   left: gx + 'px',
    //   top: gy - boardOffset + 'px',
    //   scale: 1
    // }).delay (1)
    TweenMax.to(this.element, 0.2, {
      top: gy - boardOffset + 'px'
    }).delay (0.4)     
    TweenMax.to(this.element, 0.1, {
      scale: 1
    }).delay (0.6)    
    TweenMax.to(this.element, 0.4, {
      'background-color': color,
      top: gy + 'px'
    }).delay (0.8)
  }

  _toGlobalPos (x, y) {
    let _x = offsetX + x * (this.width + offset)
    let _y = offsetY + y * (this.width + offset)

    return [_x, _y]
  }
}

export default Block
