import PDFDocument from "pdfkit";

interface IInvoiceData {
  transactionId: string;
  userName: string;
  userEmail: string;
  userPhone?: string;
  tourTitle: string;
  amount: number;
  paymentDate: Date;
  bookingId: string;
}

export const generateInvoicePDF = (data: IInvoiceData): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const chunks: Buffer[] = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    // ── Header ──────────────────────────────────────
    doc
      .fillColor("#4F46E5")
      .fontSize(28)
      .text("Travel Axis", { align: "center" })
      .moveDown(0.5);

    doc
      .fillColor("#333")
      .fontSize(16)
      .text("Payment Invoice", { align: "center" })
      .moveDown(1);

    // ── Divider ─────────────────────────────────────
    doc
      .moveTo(50, doc.y)
      .lineTo(560, doc.y)
      .strokeColor("#4F46E5")
      .lineWidth(2)
      .stroke()
      .moveDown(1);

    // ── Invoice Details ──────────────────────────────
    doc.fillColor("#333").fontSize(12);

    const addRow = (label: string, value: string) => {
      doc
        .font("Helvetica-Bold")
        .text(label, 50, doc.y, { continued: true, width: 200 })
        .font("Helvetica")
        .text(value, { align: "left" })
        .moveDown(0.5);
    };

    addRow("Invoice Date:      ", new Date().toLocaleDateString());
    addRow("Transaction ID:    ", data.transactionId);
    addRow("Booking ID:        ", data.bookingId);
    addRow("Customer Name:     ", data.userName);
    addRow("Customer Email:    ", data.userEmail);
    addRow("Customer Phone:    ", data.userPhone || "N/A");
    addRow("Tour:              ", data.tourTitle);
    addRow(
      "Payment Date:      ",
      new Date(data.paymentDate).toLocaleDateString(),
    );

    doc.moveDown(1);

    // ── Divider ─────────────────────────────────────
    doc
      .moveTo(50, doc.y)
      .lineTo(560, doc.y)
      .strokeColor("#ddd")
      .lineWidth(1)
      .stroke()
      .moveDown(1);

    // ── Amount ───────────────────────────────────────
    doc
      .fillColor("#4F46E5")
      .fontSize(18)
      .font("Helvetica-Bold")
      .text(`Total Amount: BDT ${data.amount.toFixed(2)}`, {
        align: "right",
      })
      .moveDown(2);

    // ── Footer ───────────────────────────────────────
    doc
      .fillColor("#888")
      .fontSize(10)
      .font("Helvetica")
      .text("Thank you for choosing Travel Axis!", { align: "center" })
      .text("For support: support@travelaxis.com", { align: "center" })
      .moveDown(0.5);

    // Developer credit with clickable link
    doc
      .fillColor("#aaa")
      .fontSize(9)
      .text("Developed by ", { align: "center", continued: true })
      .fillColor("#4F46E5")
      .text("Tushar Chowdhury", {
        align: "center",
        link: "https://tushar-chowdhury-protfolio.vercel.app/",
        underline: true,
      });

    doc.end();
  });
};
