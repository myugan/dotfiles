SB-CallSite
===========

SB-Callsite is a node/javascript module to manipulate stack traces. You can use it to find the filename of calee and for other purposes

#### API


```js
type Trace = shape(
  line: Number,
  col: Number,
  function: String,
  file: String
)
export function capture(): Array<Trace>
export function fromStack(string): Array<Trace>
// ^ Example Usage: callsite.fromStack(new Error().stack)
```

#### License

This project is licensed under the terms of MIT License. See the LICENSE file for more info.
