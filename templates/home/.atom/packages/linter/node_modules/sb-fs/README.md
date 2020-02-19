# FS

`sb-fs` is a Node.js module that exports a promisified FS.

## Installation

```
npm install --save sb-fs
```

## API

```js
export promisifyAll(*) from 'fs'
export function exists(path: string): Promise<boolean>
export function readFile(path: string): Promise<string>
// ^ Returns a BOM stripped string
```

## Usage

```js
import { readFile, exists, createReadStream, createWriteStream } from "sb-fs";

export default async function freedom() {
  console.log(await readFile(__filename));
  console.log(
    (await exists("/path/to/humanity")) ? "it exists!!" : "Naah it doesnt exist"
  );
  createReadStream("source.js").pipe(createWriteStream("target.js"), {
    end: true
  });
}
```

## License

This package is licensed under the terms of MIT License. See the LICENSE file for more info.
