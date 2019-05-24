# PDF Generator

Creates a PDF with tables in it.

Using now v2.

To run:

```sh
now dev # or `yarn dev`
```

Then go to:
http://localhost:3000/?tableData=[[%22Column%201%22,%22Column%202%22,%22Column%203%22],[%22Cell%201%22,%22Cell%202%22,%22Cell%203%22]]&pageOrientation=landscape&pageSize=A4

Accepts the following options:

- tables
- contents
- pageOrientation
- pageSize

## Deployment

Install `now-cli` or the Now desktop app:

```sh
npm i -g now
```

Then run:

```sh
now # or `yarn deploy`
```
