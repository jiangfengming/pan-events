export default function(element) {
  let touchId, startPosition, panning

  function touchstart(e) {
    touchId = e.changedTouches[0].identifier
    startPosition = createDetail(e.changedTouches[0])
    window.addEventListener('touchmove', touchmove)
    window.addEventListener('touchend', touchend)
    off()
  }

  function mousedown(e) {
    startPosition = createDetail(e)
    window.addEventListener('mousemove', mousemove)
    window.addEventListener('mouseup', mouseup)
    off()
  }

  function touchmove(e) {
    const data = getTouchById(e, touchId)

    if (data) {
      panmove(data)
    }
  }

  const mousemove = panmove

  function panmove(data) {
    if (!panning) {
      element.dispatchEvent(
        new CustomEvent('panstart', {
          detail: startPosition
        })
      )

      panning = true
    }

    element.dispatchEvent(
      new CustomEvent('panmove', {
        detail: createDetail(data, startPosition)
      })
    )
  }

  function touchend(e) {
    const data = getTouchById(e, touchId)

    if (data) {
      window.removeEventListener('touchmove', touchmove)
      window.removeEventListener('touchend', touchend)
      panend(data)
    }
  }

  function mouseup(e) {
    window.removeEventListener('mousemove', mousemove)
    window.removeEventListener('mouseup', mouseup)
    panend(e)
  }

  function panend(data) {
    if (panning) {
      element.dispatchEvent(
        new CustomEvent('panend', {
          detail: createDetail(data, startPosition)
        })
      )
    }

    touchId = null
    startPosition = null
    panning = false
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
