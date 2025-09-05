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
      const itemX = 50;
      const courseX = 150;
      const progressX = 250;
      const gradeX = 350;
      const lastActiveX = 450;

      doc.fontSize(10).font('Helvetica-Bold');
      doc.text('Student', itemX, tableTop);
      doc.text('Course', courseX, tableTop);
      doc.text('Progress', progressX, tableTop);
      doc.text('Grade', gradeX, tableTop);
      doc.text('Last Active', lastActiveX, tableTop);
      doc
        .moveTo(itemX - 10, doc.y)
        .lineTo(550, doc.y)
        .stroke();
      doc.moveDown();

      doc.fontSize(10).font('Helvetica');
      data.forEach((student) => {
        const rowY = doc.y;
        doc.text(student.name, itemX, rowY);
        doc.text(student.courseTitle, courseX, rowY);
        doc.text(`${student.progressPercentage}%`, progressX, rowY);
        doc.text(
          student.averageGrade !== undefined && student.averageGrade !== null
            ? `${Number(student.averageGrade).toFixed(1)}%`
            : 'N/A',
          gradeX,
          rowY
        );

        doc.moveDown();
      });

      doc.end();
    });
  }
}
