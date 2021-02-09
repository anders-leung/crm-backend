'use strict';

const PDFDocument = require('pdfkit');

class PDFDocumentWithTables extends PDFDocument {
  constructor(options) {
    super(options);
  }

  table(table, widths, rowSpacing = 5, arg0, arg1, arg2) {
    const that = this;
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

    const columnCount = table.headers.length;
    const columnSpacing = options.columnSpacing || 15;
    const usableWidth = options.width || (this.page.width - this.page.margins.left - this.page.margins.right);

    const prepareHeader = options.prepareHeader || (() => { });
    const prepareRow = options.prepareRow || (() => { });
    const computeRowHeight = (row) => {
      let result = 0;

      row.forEach((cell, i) => {
        const cellHeight = this.heightOfString(cell, {
          width: widths.column[i],
          align: widths.align[i]
        });
        result = Math.max(result, cellHeight);
      });

      return result + rowSpacing;
    };

    const columnContainerWidth = usableWidth / columnCount;
    const columnWidth = columnContainerWidth - columnSpacing;
    const maxY = this.page.height - this.page.margins.bottom;

    let rowBottomY = 0;

    // this.on('pageAdded', () => {
    //     startY = this.page.margins.top;
    //     rowBottomY = 0;
    // });

    // Allow the user to override style for headers
    prepareHeader();

    // Check to have enough room for header and first rows
    if (startY + 3 * computeRowHeight(table.headers) > maxY)
      this.addPage();


    if (table.headers.length > 0) {
      // Print all headers
      table.headers.forEach((header, i) => {
        this.text(header, startX + i * columnContainerWidth, startY, {
          width: columnWidth,
          align: 'left'
        });
      });

      // Refresh the y coordinate of the bottom of the headers row
      rowBottomY = Math.max(startY + computeRowHeight(table.headers), rowBottomY);

      // Separation line between headers and rows
      // this.moveTo(startX, rowBottomY - rowSpacing * 0.5)
      //     .lineTo(startX + usableWidth, rowBottomY - rowSpacing * 0.5)
      //     .lineWidth(2)
      //     .stroke();
    }

    let tableHeight = 0;
    table.rows.forEach((row, i) => {
      const rowHeight = computeRowHeight(row);
      tableHeight += rowHeight;

      // Switch to next page if we cannot go any further because the space is over.
      // For safety, consider 3 rows margin instead of just one
      if (startY + 3 * rowHeight < maxY)
        startY = rowBottomY + rowSpacing;
      else
        this.addPage();

      // Allow the user to override style for rows
      prepareRow(row, i);

      // Print all cells of the current row
      row.forEach((cell, i) => {
        if (cell === undefined) cell = '';
        let { text, font, fontSize } = cell;
        if (!text) text = cell || '';
        if (font) that.font(font);
        if (fontSize) that.fontSize(fontSize);
        that.text(text, startX + widths.container[i], startY, {
          width: widths.column[i],
          align: widths.align[i]
        });
      });

      // Refresh the y coordinate of the bottom of this row
      rowBottomY = startY + rowHeight;

      // // Separation line between rows
      // this.moveTo(startX, rowBottomY - rowSpacing * 0.5)
      //     .lineTo(startX + usableWidth, rowBottomY - rowSpacing * 0.5)
      //     .lineWidth(1)
      //     .opacity(0.7)
      //     .stroke()
      //     .opacity(1); // Reset opacity after drawing the line
    });

    this.x = startX;
    this.moveTo(startX, startY + tableHeight);
    this.moveDown(1);

    return this;
  }
}

module.exports = PDFDocumentWithTables;