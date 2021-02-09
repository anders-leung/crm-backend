'use strict';

const PDFDocument = require('pdfkit');

class PDFDocumentWithTables extends PDFDocument {
  constructor(options) {
    super(options);
  }

  table(table, arg0, arg1, arg2) {
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

    if (!table.headers) table.headers = [];

    const columnCount = table.rows[0].length;
    const columnSpacing = options.columnSpacing || 0;
    const rowSpacing = options.rowSpacing || 2;
    const usableWidth = options.width || (this.page.width - this.page.margins.left - this.page.margins.right);

    const prepareHeader = options.prepareHeader || (() => { });
    const prepareRow = options.prepareRow || (() => { });
    const computeRowHeight = (row) => {
      let result = 0;

      row.forEach((cell) => {
        const { text, width } = cell;
        let value = text;
        if (value === undefined) value = cell;

        const cellHeight = this.heightOfString(value, {
          width: width || columnWidth,
          align: 'left'
        });
        result = Math.max(result, cellHeight);
      });

      // return result + rowSpacing;
      return result - 2;
    };

    const columnContainerWidth = usableWidth / columnCount;
    const columnWidth = columnContainerWidth - columnSpacing;
    const maxY = this.page.height - this.page.margins.bottom;

    let rowBottomY = 0;

    this.on('pageAdded', pageAdded);
    function pageAdded() {
      startY = this.page.margins.top;
      rowBottomY = 0;
    }

    // Allow the user to override style for headers
    prepareHeader();

    // Check to have enough room for header and first rows
    if (startY + 3 * computeRowHeight(table.headers) > maxY)
      this.addPage();

    // Print all headers
    this.font('Times-Bold');
    let headerX = startX;
    table.headers.forEach((header) => {
      const { text, width, notBold } = header;
      if (notBold) this.font('Times-Roman');

      this.text((text || header), headerX, startY, {
        width: width || usableWidth,
        align: 'left',
      });

      if (width) headerX += width;
      else headerX += columnContainerWidth;
    });

    // Refresh the y coordinate of the bottom of the headers row
    rowBottomY = Math.max(startY + computeRowHeight(table.headers), rowBottomY);

    // Separation line between headers and rows
    if (table.headers.length > 0) {
      this.moveTo(startX, rowBottomY - rowSpacing * 0.5)
        .lineTo(startX + usableWidth, rowBottomY - rowSpacing * 0.5)
        .lineWidth(2)
        .stroke();
    }

    let lastCell;
    table.rows.forEach((row, i) => {
      let rowHeight = computeRowHeight(row);
      // if (i === 0) rowHeight -= 2;

      // Switch to next page if we cannot go any further because the space is over.
      // For safety, consider 3 rows margin instead of just one
      if (startY + 3 * rowHeight < maxY)
        startY = rowBottomY + rowSpacing;
      else
        this.addPage();

      // Allow the user to override style for rows
      prepareRow(row, i);

      // Print all cells of the current row
      let currentX = startX;
      row.forEach((cell, i) => {
        let { text, width, align } = cell;
        this.font('Times-Roman');
        if (cell.text !== undefined) {
          if (cell.bold) this.font('Times-Bold');
        } else {
          text = cell;
        }

        const args = [text, currentX, startY, { width: width || columnWidth, align: align || 'left' }];
        this.text(...args);
        const height = this.heightOfString(...args);
        if (height > rowHeight) rowHeight = height;

        if (width) currentX += width;
        else currentX += columnContainerWidth;
        lastCell = text;
      });

      // Refresh the y coordinate of the bottom of this row
      rowBottomY = Math.max(startY + rowHeight, rowBottomY);

      // Separation line between rows
      // this.moveTo(startX, rowBottomY - rowSpacing * 0.5)
      //   .lineTo(startX + usableWidth, rowBottomY - rowSpacing * 0.5)
      //   .lineWidth(1)
      //   .opacity(0.7)
      //   .stroke()
      //   .opacity(1); // Reset opacity after drawing the line
    });

    this.x = startX;
    this.moveDown(0.5);
    if (!lastCell) this.moveDown(1);

    return this.removeListener('pageAdded', pageAdded);
  }
}

module.exports = PDFDocumentWithTables;
