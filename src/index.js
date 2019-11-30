export default function(element) {
  let touchId, startPosition

  function touchstart(e) {
    touchId = e.changedTouches[0].identifier
    startPosition = createDetail(e.changedTouches[0])

    if (panstart()) {
      element.addEventListener('touchmove', touchmove)
      element.addEventListener('touchend', touchend)
      off()
    }
  }

  function mousedown(e) {
    if (e.sourceCapabilities && e.sourceCapabilities.firesTouchEvents) {
      return
    }

    if (panstart()) {
      startPosition = createDetail(e)
      element.addEventListener('mousemove', mousemove)
      element.addEventListener('mouseup', mouseup)
      off()
    }
  }

  function panstart() {
    return element.dispatchEvent(
      new CustomEvent('panstart', {
        detail: startPosition,
        cancelable: true
      })
    )
  }

  function touchmove(e) {
    const data = getTouchById(e, touchId)

    if (data) {
      if (!panmove(data) && e.cancelable) {
        e.preventDefault()
      }
    }
  }

  const mousemove = panmove

  function panmove(data) {
    return element.dispatchEvent(
      new CustomEvent('panmove', {
        detail: createDetail(data, startPosition),
        cancelable: true
      })
    )
  }

  function touchend(e) {
    const data = getTouchById(e, touchId)

    if (data) {
      element.removeEventListener('touchmove', touchmove)
      element.removeEventListener('touchend', touchend)
      panend(data)
    }
  }

  function mouseup(e) {
    element.removeEventListener('mousemove', mousemove)
    element.removeEventListener('mouseup', mouseup)
    panend(e)
  }

  function panend(data) {
    element.dispatchEvent(
      new CustomEvent('panend', {
        detail: createDetail(data, startPosition)
      })
    )

    touchId = null
    startPosition = null
    on()
  }

  function createDetail(data, startPosition) {
    const detail = {
      screenX: data.screenX,
      screenY: data.screenY,
      clientX: data.clientX,
      clientY: data.clientY,
      pageX: data.pageX,
      pageY: data.pageY
    }

    if (startPosition) {
      detail.offsetX = data.clientX - startPosition.clientX
      detail.offsetY = data.clientY - startPosition.clientY
    }

    return detail
  }

  function getTouchById(e, id) {
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[0].identifier === id) {
        return e.changedTouches[0]
      }
    }
  }

  function on() {
    element.addEventListener('touchstart', touchstart)
    element.addEventListener('mousedown', mousedown)
  }

  function off() {
    element.removeEventListener('touchstart', touchstart)
    element.removeEventListener('mousedown', mousedown)
  }

  on()
  return off
}
