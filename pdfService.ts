import jsPDF from 'jspdf';

export interface GeneratePDFOptions {
  letterText: string;
  filename?: string;
}

export const pdfService = {
  generatePDF(options: GeneratePDFOptions): Blob {
    const { letterText, filename = 'fixmyproblem-letter.pdf' } = options;

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    const maxWidth = pageWidth - (margin * 2);
    const lineHeight = 7;
    const fontSize = 11;

    pdf.setFont('times', 'normal');
    pdf.setFontSize(fontSize);

    const lines = letterText.split('\n');
    let yPosition = margin;

    lines.forEach((line) => {
      if (yPosition + lineHeight > pageHeight - margin) {
        pdf.addPage();
        yPosition = margin;
      }

      if (line.trim() === '') {
        yPosition += lineHeight * 0.5;
      } else {
        const wrappedLines = pdf.splitTextToSize(line, maxWidth);
        wrappedLines.forEach((wrappedLine: string) => {
          if (yPosition + lineHeight > pageHeight - margin) {
            pdf.addPage();
            yPosition = margin;
          }
          pdf.text(wrappedLine, margin, yPosition);
          yPosition += lineHeight;
        });
      }
    });

    return pdf.output('blob');
  },

  downloadPDF(options: GeneratePDFOptions): void {
    const { filename = 'fixmyproblem-letter.pdf' } = options;
    const blob = this.generatePDF(options);

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  async blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const base64Data = base64String.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  },

  async generateBase64PDF(options: GeneratePDFOptions): Promise<string> {
    const blob = this.generatePDF(options);
    return this.blobToBase64(blob);
  }
};
