# PDF Generator

Creates a PDF with a table in it.

Using now v2.

To run:

```sh
now dev
```

Then go to:
http://localhost:3000/?tableData=[[%22Column%201%22,%22Column%202%22,%22Column%203%22],[%22Cell%201%22,%22Cell%202%22,%22Cell%203%22]]&pageOrientation=landscape&pageSize=A4

Accepts 3 options:

- tableData
- pageOrientation
- pageSize

## Deployment

Install `now-cli`, then run:

```sh
now
```