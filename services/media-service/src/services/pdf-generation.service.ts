import { format } from 'date-fns';
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

      const drawTableHeader = (y: number) => {
        const headers = [
          'Student',
          'Course',
          'Progress',
          'Grade',
          'Last Active',
        ];
        const columnWidths = [120, 180, 60, 50, 90];
        let x = 50;

        doc
          .rect(50, y - 5, 500, 20)
          .fill('#2d3748')
          .stroke();

        doc.fontSize(9).font('Helvetica-Bold').fillColor('white');

        headers.forEach((header, i) => {
          doc.text(header, x + 2, y, { width: columnWidths[i] - 4 });
          x += columnWidths[i];
        });

        doc.fillColor('black');

        return y + 25;
      };

      const addTitleAndDescription = () => {
        doc.y = 50;

        const pageWidth = doc.page.width - 100;
        const startX = 50;

        // doc
        //   .fontSize(16)
        //   .font('Helvetica-Bold')
        //   .fillColor('#c53030')
        //   .text('CLASSIFIED - LEARNSPHERE', startX, doc.y, {
        //     width: pageWidth,
        //     align: 'center',
        //   });

        // doc.y += 20;

        doc
          .fontSize(18)
          .font('Helvetica-Bold')
          .fillColor('#2d3748')
          .text('Student Performance Report', startX, doc.y, {
            width: pageWidth,
            align: 'center',
          });

        doc.y += 15;

        const now = format(new Date(), 'PPP p');

        doc
          .fontSize(11)
          .font('Helvetica')
          .fillColor('#4a5568')
          .text(`Generated on: ${now}`, startX, doc.y, {
            width: pageWidth,
            align: 'center',
          });

        doc.y += 12;

        doc
          .fontSize(9)
          .font('Helvetica-Oblique')
          .fillColor('#718096')
          .text(
            'This report contains detailed analytics of student progress and performance.\nFor internal use only.',
            startX,
            doc.y,
            {
              width: pageWidth,
              align: 'center',
            }
          )
          .fillColor('black');

        doc.y += 25;

        return doc.y;
      };

      const tableStartY = addTitleAndDescription();

      const columnWidths = [120, 180, 60, 50, 90];
      let currentY = drawTableHeader(tableStartY);
      const rowHeight = 18;

      doc.on('pageAdded', () => {
        currentY = drawTableHeader(60);
      });

      doc.fontSize(8).font('Helvetica');

      data.forEach((student, index) => {
        if (
          currentY + rowHeight + 25 >
          doc.page.height - doc.page.margins.bottom
        ) {
          doc.addPage();
        }

        if (index % 2 === 0) {
          doc
            .rect(50, currentY - 2, 500, rowHeight)
            .fill('#f8f9fa')
            .stroke();
        }

        doc.fillColor('black');

        const x = 50;

        doc.text(student.name || 'Unknown User', x + 2, currentY + 3, {
          width: columnWidths[0] - 4,
          ellipsis: true,
          lineBreak: false,
        });

        const courseText = student.courseTitle || 'N/A';
        doc.text(courseText, x + columnWidths[0] + 2, currentY + 3, {
          width: columnWidths[1] - 4,
          height: rowHeight - 6,
          ellipsis: true,
        });

        const progress = Number(student.progressPercentage);
        const progressText = isNaN(progress)
          ? 'N/A'
          : `${progress.toFixed(1)}%`;
        doc.text(
          progressText,
          x + columnWidths[0] + columnWidths[1] + 2,
          currentY + 3,
          { width: columnWidths[2] - 4, align: 'right' }
        );

        const grade =
          student.averageGrade !== null && !isNaN(Number(student.averageGrade))
            ? `${Number(student.averageGrade).toFixed(1)}%`
            : 'N/A';
        doc.text(
          grade,
          x + columnWidths[0] + columnWidths[1] + columnWidths[2] + 2,
          currentY + 3,
          { width: columnWidths[3] - 4, align: 'right' }
        );

        const lastActiveText = student.lastActive
          ? format(new Date(student.lastActive), 'PP')
          : 'N/A';
        doc.text(
          lastActiveText,
          x +
            columnWidths[0] +
            columnWidths[1] +
            columnWidths[2] +
            columnWidths[3] +
            2,
          currentY + 3,
          { width: columnWidths[4] - 4, align: 'right' }
        );

        doc
          .moveTo(50, currentY + rowHeight - 1)
          .lineTo(550, currentY + rowHeight - 1)
          .strokeColor('#e2e8f0')
          .lineWidth(0.3)
          .stroke();

        currentY += rowHeight;
      });

      doc.end();
    });
  }
}
