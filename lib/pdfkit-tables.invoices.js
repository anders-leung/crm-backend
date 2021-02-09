'use strict';

const PDFDocument = require('pdfkit');

class PDFDocumentWithTables extends PDFDocument {
  constructor(options) {
    super(options);
  }

  table(table, widths, alignments, rowSpacings, arg0, arg1, arg2) {
    let startX = this.page.margins.left, startY = this.y;
    let options = {};

    if ((typeof arg0 === 'number') && (typeof arg1 === 'number')) {
      startX = arg0;
      startY = arg1;

      if (typeof arg2 === 'object')
        options = arg2;
    } else if (typeof arg0 === 'object') {
      options = arg0;
    }

    const columnSpacing = options.columnSpacing || 0;
    const usableWidth = options.width || (this.page.width - this.page.margins.left - this.page.margins.right);

    const prepareHeader = options.prepareHeader || (() => { });
    const prepareRow = options.prepareRow || (() => { });
    const computeRowHeight = (row, i) => {
      let result = 0;

      row.forEach((cell, j) => {
        const width = widths[j];
        const align = alignments[j];
        const cellHeight = this.heightOfString(cell, { width, align });
        result = Math.max(result, cellHeight);
      });

      return result + rowSpacings[i];
    };

    const maxY = this.page.height - this.page.margins.bottom;

    let rowBottomY = startY;

    this.on('pageAdded', () => {
      startY = this.page.margins.top;
      rowBottomY = 0;
    });

    // Allow the user to override style for headers
    prepareHeader();

    // Check to have enough room for header and first rows
    if (table.headers) {
      if (startY + 3 * computeRowHeight(table.headers) > maxY)
        this.addPage();

      // Print all headers
      table.headers.forEach((header, i) => {
        this.text(header, startX + widths[i], startY, {
          width: widths[i] - columnSpacing,
          align: 'left'
        });
      });

      // Refresh the y coordinate of the bottom of the headers row
      rowBottomY = Math.max(startY + computeRowHeight(table.headers), rowBottomY);

      // Separation line between headers and rows
      this.moveTo(startX, rowBottomY - rowSpacing * 0.5)
        .lineTo(startX + usableWidth, rowBottomY - rowSpacing * 0.5)
        .lineWidth(2)
        .stroke();
    }

    table.rows.forEach((row, i) => {
      const rowHeight = computeRowHeight(row, i);
      let x = startX;

      // Allow the user to override style for rows
      prepareRow(row, i);

      // Print all cells of the current row
      row.forEach((cell, j) => {
        let text = cell;
        if (typeof cell === 'object') {
          const { font, fontSize } = cell;
          text = cell.text;
          font && this.font(font);
          fontSize && this.fontSize(fontSize);
        } else if (typeof cell === undefined) {
          text = '';
        }

        this.text(text, x, startY, {
          width: widths[j] - columnSpacing,
          align: alignments[j],
        });
        x += widths[j];
      });

      // Refresh the y coordinate of the bottom of this row
      // rowBottomY = Math.max(startY + rowHeight, rowBottomY);
      if (rowSpacings[i]) startY += rowSpacings[i];
      startY += rowHeight;
    });

    this.moveTo(startX, startY);

    return this;
  }
}

module.exports = PDFDocumentWithTables;