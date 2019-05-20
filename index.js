const { parse } = require('url')
const PdfPrinter = require('pdfmake')
const pdfMakeFonts = require('pdfmake/build/vfs_fonts.js').pdfMake.vfs
const { Regular, Medium, Bold } = require('./david')

module.exports = (req, res) => {
  const {
    query: { tableData = [], pageOrientation = 'portrait', pageSize = 'A4' },
  } = parse(req.url, true)

  const table = JSON.parse(tableData)

  // console.log(table)

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
    content: [
      { text: 'Report', style: 'header' },
      {
        style: 'table',
        // layout: 'lightHorizontalLines',
        table: {
          // example:
          // body: [['Column 1', 'Column 2', 'Column 3'], ['Cell 1', 'Cell 2', 'Cell 3']],
          body: table,
        },
      },
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

  res.setHeader('Access-Control-Allow-Origin', '*')

  const pdfDoc = printer.createPdfKitDocument(docDefinition)
  pdfDoc.pipe(res)
  pdfDoc.end()
}
