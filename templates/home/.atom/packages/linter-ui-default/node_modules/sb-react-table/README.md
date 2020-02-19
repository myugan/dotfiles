# ReactTable

[![Greenkeeper badge](https://badges.greenkeeper.io/steelbrain/react-table.svg)](https://greenkeeper.io/)

React-Table is an efficient React table component that gives you freedom.

## Installation

```
npm install --save sb-react-table
```

## API

```js
type Row = Object | Array
type Column = {
   key: string,
   label: string,
   sortable?: boolean,
   onClick?: ((e: MouseEvent, row: Object) => any),
}
type SortInfo = Array<{ column: string, type: 'asc' | 'desc' }>

<ReactTable
  rows: Array<Row>,
  columns: Array<Column>,

  style?: Object,
  className?: string,

  initialSort?: SortInfo,
  sort?: ((sortInfo: SortInfo, rows: Array<Row>) => Array<Row>),
  rowKey: ((row: Row) => string),
  // ^ aka a function that takes row and returns string unique key for that row

  renderHeaderColumn?: ((headerColumn: any) => string),
  renderBodyColumn?: ((row: Object, column: string) => string),
/>
```

## Usage

```js
const ReactTable = require('sb-react-table')

const rows = [
  { file: '/path/a', message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus id molestie nisi' },
  { file: '/path/b', message: 'Vivamus tincidunt ligula ut ligula laoreet faucibus' },
  { file: '/path/a', message: 'Proin tincidunt justo nulla, sit amet accumsan lectus pretium vel' },
  { file: '/path/a', message: 'Cras faucibus eget ante ut consectetur' },
]
const columns = [
  {
    key: 'file',
    label: 'File',
    sortable: true,
  },
  {
    key: 'message',
    label: 'Message',
  }
]

export default class MyTable extends ReactTable {
  sortRows(sortInfo: Array<Object>, rows: Array<Object>): Array<Object> {
    // Convert [{key: 'file', type: 'asc'}] -> { file: 'asc' }
    const sortColumns = {}
    for (let i = 0, length = sortInfo.length; i < length; i++) {
      const entry = sortInfo[i]
      sortColumns[entry.column] = entry.type
    }

    return rows.sort(function(a, b) {
      if (sortColumns.file) {
        const multiplyWith = sortColumns.file === 'asc' ? 1 : -1
        const sortValue = a.severity.localeCompare(b.severity)
        if (sortValue !== 0) {
          return multiplyWith * sortValue
        }
      }
    })
  }
  render() {
    return (
      <ReactTable
        rows={rows},
        columns={columns},
        initialSort={[{ column: 'file', type: 'asc' }]}
        sort={this.sortRows}
        rowKey={row => JSON.stringify(row)}
        renderHeaderColumn={column => <span>{column}</span>}
        renderBodyColumn={(row, column) => <span>{row[column]}</span>}
      />
    )
  }
}
```

## License

This package is licensed under the terms of MIT License.
