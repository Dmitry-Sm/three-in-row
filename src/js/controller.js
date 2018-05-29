function Controller() {
  let dx, dy
  let DELTA_SWIP_X = 10
  let DELTA_SWIP_Y = 10

  let mouse_pressed = false
  let target = null
  let swipe_event = new Event('swipe')


  function startup() {
    let el = document.getElementById('page')
    el.addEventListener('touchstart', mousedown, false)
    el.addEventListener('touchend', mouseup, false)
    el.addEventListener('touchmove', mousemove, false)

    el.ontouchstartn = mousedown
    el.ontouchend = mouseup
    el.ontouchmove = mousemove

    el.addEventListener('mousedown', mousedown, false)
    el.addEventListener('mouseup', mouseup, false)
    el.addEventListener('mousemove', mousemove, false)
    el.addEventListener('mouseout', mouseout, false)
  }
  startup()

  function mousedown (event) {
    target = event.target
    swipe_event.myTarget = target

    mouse_pressed = true

    if (event.changedTouches) {
      let touches = event.changedTouches
      swipe_event.x1 = touches[touches.length - 1].pageX
      swipe_event.y1 = touches[touches.length - 1].pageY
    } else {
      swipe_event.x1 = event.x
      swipe_event.y1 = event.y
    }
  }


  function mouseup(event) {
    mouse_pressed = false
  }


  function mouseout(event) {
    //mouse_pressed = false
  }


  function mousemove(event) {
    if (mouse_pressed) {
      if (event.changedTouches) {
        let touches = event.changedTouches
        dx = swipe_event.x1 - touches[0].pageX
        dy = swipe_event.y1 - touches[0].pageY

      } else {
        dx = swipe_event.x1 - event.x
        dy = swipe_event.y1 - event.y
      }

      if (Math.abs(dx) > DELTA_SWIP_X) {

        if (dx > DELTA_SWIP_X) {
          swipe_event.dir = 'left'
        }

        if (dx < -DELTA_SWIP_X) {
          swipe_event.dir = 'right'
        }

        mouse_pressed = false
        dispatchEvent(swipe_event)
        return
      }

      if (Math.abs(dy) > DELTA_SWIP_Y) {
        if (dy > DELTA_SWIP_Y) {
          swipe_event.dir = 'up'
        }

        if (dy < -DELTA_SWIP_Y) {
          swipe_event.dir = 'down'
        }

        mouse_pressed = false
        dispatchEvent(swipe_event)
        return
      }
    }
  }
}


export default Controller()
