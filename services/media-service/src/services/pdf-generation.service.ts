import PDFDocument from 'pdfkit';
import { EnrichedStudentPerformance } from '../types';

export class PdfGenerationService {
  public static generateStudentPerformanceReport(
    data: EnrichedStudentPerformance[]
  ): Promise<Buffer> {
    return new Promise((resolve) => {
      const doc = new PDFDocument({ margin: 50 });
      const buffers: Buffer[] = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        resolve(Buffer.concat(buffers));
      });

      const addWaterMark = (document: PDFKit.PDFDocument) => {
        const pageWidth = document.page.width;
        const pageHeight = document.page.height;
        document
          .fontSize(50)
          .fillColor('grey')
          .opacity(0.15)
          .text('LearnSphere', 0, pageHeight / 3 - 50, {
            align: 'center',
            lineBreak: false,
          })
          .opacity(1)
          .fillColor('black');
      };

      addWaterMark(doc);
      doc.on('pageAdded', () => addWaterMark(doc));

      doc
        .fontSize(20)
        .font('Helvetica-Bold')
        .text('Student Performance Report', { align: 'center' });
      doc
        .fontSize(12)
        .font('Helvetica')
        .text(`Generated on: ${new Date().toLocaleDateString()}`, {
          align: 'center',
        });
      doc.moveDown(2);

      const tableTop = doc.y;
      const tableHeaders = [
        'Student',
        'Course',
        'Progress',
        'Grade',
        'Last Active',
      ];
      const columnWidths = [150, 150, 70, 50, 80];
      let currentX = 30;

      doc.fontSize(10).font('Helvetica-Bold');
      tableHeaders.forEach((header, i) => {
        doc.text(header, currentX, tableTop, { width: columnWidths[i] });
        currentX += columnWidths[i];
      });
      doc.moveTo(30, doc.y).lineTo(565, doc.y).stroke();
      doc.moveDown(0.5);

      doc.fontSize(9).font('Helvetica');
      data.forEach((student) => {
        const rowY = doc.y;
        const rowHeight = 40;

        if (rowY + rowHeight > doc.page.height - doc.page.margins.bottom) {
          doc.addPage();
        }

        currentX = 30;

        doc.text(student.name, currentX, doc.y, { width: columnWidths[0] });
        doc.text(student.courseTitle, currentX + columnWidths[0], rowY, {
          width: columnWidths[1],
        });
        doc.text(
          `${parseFloat(student.progressPercentage).toFixed(2)}%`,
          currentX + columnWidths[0] + columnWidths[1],
          rowY,
          { width: columnWidths[2] }
        );
        doc.text(
          student.averageGrade ? `${student.averageGrade.toFixed(1)}%` : 'N/A',
          currentX + columnWidths[0] + columnWidths[1] + columnWidths[2],
          rowY,
          { width: columnWidths[3] }
        );
        doc.text(
          new Date(student.lastActive).toLocaleDateString(),
          currentX +
            columnWidths[0] +
            columnWidths[1] +
            columnWidths[2] +
            columnWidths[3],
          rowY,
          { width: columnWidths[4] }
        );

        doc.y = rowY;
        doc.moveDown(3);

        doc
          .moveTo(30, doc.y)
          .lineTo(565, doc.y)
          .strokeColor('#dddddd')
          .stroke();
        doc.moveDown(0.5);
      });

      doc.end();
    });
  }
}
