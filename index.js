const { parse } = require('url')
const PdfPrinter = require('pdfmake')
const pdfMakeFonts = require('pdfmake/build/vfs_fonts.js').pdfMake.vfs
const { Regular, Medium, Bold } = require('./david')

/**
 * tables - an array of objects with the following fields:
 *   - title: string - the section header
 *   - table: string[][] - 2 dimenstional array of table data
 * content - `pdfmake` content. if this field is provided it is used instead of `tables`
 * pageOrientation - potrait (default) or landscape
 * pageSize - default A4
 */
module.exports = (req, res) => {
  const {
    query: { tables = [], pageOrientation = 'portrait', pageSize = 'A4', content },
  } = parse(req.url, true)

  let parsedTables

  try {
    parsedTables = JSON.parse(tables)
  } catch (error) {
    console.error(error)
    return res.end({
      status: 422,
      message: 'table must be JSON',
      error,
    })
  }

  // example
  // parsedTables = [
  //   {
  //     title: 'Report',
  //     table: [['Column 1', 'Column 2', 'Column 3'], ['Cell 1', 'Cell 2', 'Cell 3']],
  //   },
  //   {
  //     title: 'Table 2',
  //     table: [
  //       ['Column 1', 'Column 2', 'Column 3'],
  //       ['Cell 1', 'Cell 2', 'Cell 3'],
  //       ['Cell 1', 'Cell 2', 'Cell 3'],
  //       ['Cell 1', 'Cell 2', 'Cell 3'],
  //     ],
  //   },
  // ]

  const printer = new PdfPrinter({
    Roboto: {
      normal: new Buffer(Regular, 'base64'),
      bold: new Buffer(Bold, 'base64'),
      italics: new Buffer(Medium, 'base64'),
      bolditalics: new Buffer(Medium, 'base64'),
      // if you prefer `Roboto` font you can do this:
      // normal: new Buffer(pdfMakeFonts['Roboto-Regular.ttf'], 'base64'),
      // bold: new Buffer(pdfMakeFonts['Roboto-Medium.ttf'], 'base64'),
      // italics: new Buffer(pdfMakeFonts['Roboto-Italic.ttf'], 'base64'),
      // bolditalics: new Buffer(pdfMakeFonts['Roboto-MediumItalic.ttf'], 'base64'),
    },
  })

  const docDefinition = {
    content: content || [
      ...parsedTables.map(({ title, table }) => [
        { text: title, style: 'header' },
        {
          style: 'table',
          // layout: 'lightHorizontalLines',
          table: {
            body: table,
          },
        },
      ]),
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        margin: [0, 0, 0, 10],
      },
      subheader: {
        fontSize: 16,
        bold: true,
        margin: [0, 10, 0, 5],
      },
      table: {
        margin: [0, 5, 0, 15],
      },
      tableHeader: {
        bold: true,
        fontSize: 13,
        color: 'black',
      },
    },
    defaultStyle: {
      // alignment: 'justify'
    },

    pageSize,
    pageOrientation,
  }

  const pdfDoc = printer.createPdfKitDocument(docDefinition)

  res.setHeader('Access-Control-Allow-Origin', '*')

  pdfDoc.pipe(res)
  pdfDoc.end()
}
