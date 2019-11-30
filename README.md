# pan-events
Add `panstart`, `panmove` and `panend` custom events to an element, support touch and mouse.

## Demo
Open it in desktop or mobile browser: [demo](https://jiangfengming.github.io/pan-events/example.html)

## Usage
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>pan-events</title>
  <style>
  #box {
    width: 50px;
    height: 50px;
    background: red;
    margin: 100px auto;
  }
  </style>
</head>
<body>
  <button id="off">off</button>
  <div id="box"></div>

  <script type="module">
  import panEvents from 'https://unpkg.com/pan-events'

  const box = document.getElementById('box')
  const off = panEvents(box)

  box.addEventListener('panstart', e => {
    console.log('panstart', e.detail)
  })

  box.addEventListener('panmove', e => {
    console.log('panmove', e.detail)

    // prevent pull-to-refresh of mobile Chrome
    e.preventDefault()

    box.style = `transform: translate(${e.detail.offsetX}px, ${e.detail.offsetY}px)`
  })

  box.addEventListener('panend', e => {
    console.log('panend', e.detail)
    box.style = ''
  })

  document.getElementById('off').addEventListener('click', off)
  </script>
</body>
</html>
```

## Install
```
npm install pan-events
```

## Import
```js
import panEvents from 'pan-events'
```

## panEvents
```js
const off = panEvents(element)
```

Adds `panstart`, `panmove` and `panend` [custom events](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent)
to the element.

### Returns
A function to remove listeners.

## Events
After `panEvents` is called on an element, it will have `panstart`, `panmove`, and `panend` events.

```js
element.addEventListener('panstart', event => {
  console.log(event.detail)
})

element.addEventListener('panmove', event => {
  console.log(event.detail)
})

element.addEventListener('panend', event => {
  console.log(event.detail)
})
```

`event.detail` contains:

```js
{
  screenX,
  screenY,
  clientX,
  clientY,
  pageX,
  pageY
}
```

`panmove` and `panend` have additional `offsetX` and `offsetY` properties, which are relative to the position of
`panstart` event.

### preventDefault
If `event.preventDefault()` is called in `panstart` event, subsequent `panmove` won't be fired.

If `event.preventDefault()` is called in `panmove` event, and the original event is `touchmove`, the `touchmove`
event is prevented. This is used to prevent pull-to-refresh of mobile Chrome and scrolling.

## License
[MIT](LICENSE)
