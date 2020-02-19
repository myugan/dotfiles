## etch-octicon

[![npm package][npm-badge]][npm]

An [Etch](https://github.com/atom/etch/) component which renders a [GitHub Octicons](https://octicons.github.com/) icon.

![All Octicons](octicons.gif)

### Usage

Install and use the Octicon component like so:

```
npm install --save etch-octicon
```

```js
import Octicon from 'etch-octicon'

let App = () => <div>
  <Octicon mega spin name="sync"/>
</div>

render(<App/>, document.querySelector('#app'))
```

### Required props

Prop | Description
---- | -------------
`name` | The name of an icon in the Octicons set, e.g. `'trashcan'`

### Other props

Prop | Description
---- | -------------
`className` | An additional class name for the element rendered by the component
`mega` | If `true`, a double-size icon will be displayed
`spin` | If `true`, the icon will spin

## MIT licensed

[npm-badge]: https://img.shields.io/npm/v/etch-octicon.svg?style=flat-square
[npm]: https://www.npmjs.org/package/etch-octicon
