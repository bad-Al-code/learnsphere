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
          .fill('#262626')
          .stroke();

        doc.fontSize(9).font('Helvetica-Bold').fillColor('#fafafa');

        headers.forEach((header, i) => {
          doc.text(header, x + 2, y, { width: columnWidths[i] - 4 });
          x += columnWidths[i];
        });

        doc.fillColor('#171717');

        return y + 25;
      };

      const addTitleAndDescription = () => {
        doc.y = 50;

        const pageWidth = doc.page.width - 100;
        const startX = 50;

        doc
          .fontSize(16)
          .font('Helvetica-Bold')
          .fillColor('#0a0a0a')
          .text('LEARNSPHERE', startX, doc.y, {
            width: pageWidth,
            align: 'center',
          });

        doc.y += 20;

        doc
          .fontSize(18)
          .font('Helvetica-Bold')
          .fillColor('#262626')
          .text('Student Performance Report', startX, doc.y, {
            width: pageWidth,
            align: 'center',
          });

        doc.y += 15;

        const now = format(new Date(), 'PPP p');

        doc
          .fontSize(11)
          .font('Helvetica')
          .fillColor('#525252')
          .text(`Generated on: ${now}`, startX, doc.y, {
            width: pageWidth,
            align: 'center',
          });

        doc.y += 12;

        doc
          .fontSize(9)
          .font('Helvetica-Oblique')
          .fillColor('#737373')
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
            .fill('#f5f5f5')
            .stroke();
        }

        doc.fillColor('#171717');

        const x = 50;

        const studentName = student.name || 'Unknown User';
        const truncatedName = truncateText(
          studentName,
          columnWidths[0] - 4,
          doc
        );

        doc.text(truncatedName, x + 2, currentY + 3, {
          width: columnWidths[0] - 4,
          lineBreak: false,
        });

        const courseText = student.courseTitle || 'N/A';
        const truncatedCourse = truncateText(
          courseText,
          columnWidths[1] - 4,
          doc
        );
        doc.text(truncatedCourse, x + columnWidths[0] + 2, currentY + 3, {
          width: columnWidths[1] - 4,
          lineBreak: false,
        });

        const progress = Number(student.progressPercentage);
        const progressText = isNaN(progress)
          ? 'N/A'
          : `${progress.toFixed(1)}%`;
        doc.text(
          progressText,
          x + columnWidths[0] + columnWidths[1] + 2,
          currentY + 3,
          { width: columnWidths[2] - 4, align: 'left' }
        );

        const grade =
          student.averageGrade !== null && !isNaN(Number(student.averageGrade))
            ? `${Number(student.averageGrade).toFixed(1)}%`
            : 'N/A';
        doc.text(
          grade,
          x + columnWidths[0] + columnWidths[1] + columnWidths[2] + 2,
          currentY + 3,
          { width: columnWidths[3] - 4, align: 'center' }
        );

        const lastActiveText = student.lastActive || 'N/A';
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
          .strokeColor('#e5e5e5')
          .lineWidth(0.3)
          .stroke();

        currentY += rowHeight;
      });

      doc.end();
    });
  }
}

function truncateText(
  text: string,
  maxWidth: number,
  doc: PDFKit.PDFDocument
): string {
  let truncated = text;
  while (
    doc.widthOfString(truncated + '…') > maxWidth &&
    truncated.length > 0
  ) {
    truncated = truncated.slice(0, -1);
  }
  return truncated.length < text.length ? truncated + '…' : truncated;
}
