import { PDFDocument, PDFPage, PDFFont, StandardFonts, rgb } from "pdf-lib";

export type RegistrationPdfData = {
  regNumber: string;
  eventName: string;
  accent: [number, number, number];
  participant: {
    name: string;
    phone?: string;
    email?: string;
    category?: string;
    jerseySize?: string;
    bikeType?: string;
    emergencyContactName?: string;
    emergencyContactPhone?: string;
  };
  eventDate: string;
  eventLocation: string;
  paymentAmount: string;
  paymentMethod?: string;
  paymentStatus: string;
  proof: { bytes: ArrayBuffer; mimeType: string };
  printedAt: string;
};

const A4 = { width: 595.28, height: 841.89 };
const margin = 42;
const dark = rgb(0.06, 0.09, 0.16);
const muted = rgb(0.36, 0.42, 0.50);
const border = rgb(0.88, 0.90, 0.93);
const soft = rgb(0.97, 0.98, 0.99);

function wrapText(text: string, font: PDFFont, size: number, maxWidth: number) {
  const words = (text || "-").split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, size) <= maxWidth || !line) line = candidate;
    else {
      lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function drawWrapped(page: PDFPage, text: string, x: number, y: number, options: {
  font: PDFFont; size: number; maxWidth: number; color?: ReturnType<typeof rgb>; lineHeight?: number;
}) {
  const lines = wrapText(text, options.font, options.size, options.maxWidth);
  const lineHeight = options.lineHeight ?? options.size * 1.3;
  lines.forEach((line, index) => page.drawText(line, {
    x, y: y - index * lineHeight, font: options.font, size: options.size, color: options.color ?? dark,
  }));
  return y - lines.length * lineHeight;
}

function sectionTitle(page: PDFPage, title: string, y: number, bold: PDFFont, accent: ReturnType<typeof rgb>) {
  page.drawRectangle({ x: margin, y: y - 4, width: 4, height: 15, color: accent });
  page.drawText(title, { x: margin + 12, y, font: bold, size: 12, color: dark });
  return y - 24;
}

function detailGrid(page: PDFPage, rows: Array<[string, string | undefined]>, y: number, regular: PDFFont, bold: PDFFont) {
  const columnWidth = (A4.width - margin * 2 - 14) / 2;
  rows.forEach(([label, rawValue], index) => {
    const column = index % 2;
    const row = Math.floor(index / 2);
    const x = margin + column * (columnWidth + 14);
    const rowTop = y - row * 48;
    page.drawText(label.toUpperCase(), { x, y: rowTop, font: bold, size: 7.5, color: muted });
    drawWrapped(page, rawValue || "-", x, rowTop - 14, { font: regular, size: 10, maxWidth: columnWidth, lineHeight: 12 });
  });
  return y - Math.ceil(rows.length / 2) * 48;
}

function addFooter(page: PDFPage, regular: PDFFont, printedAt: string) {
  page.drawLine({ start: { x: margin, y: 48 }, end: { x: A4.width - margin, y: 48 }, thickness: 0.7, color: border });
  page.drawText(`Dicetak: ${printedAt}`, { x: margin, y: 31, font: regular, size: 8, color: muted });
  const note = "(c) 2026 Futuristic Vibes - Tunjukkan/simpan bukti ini.";
  const noteWidth = regular.widthOfTextAtSize(note, 8);
  page.drawText(note, { x: A4.width - margin - noteWidth, y: 31, font: regular, size: 8, color: muted });
}

export async function createRegistrationPdf(data: RegistrationPdfData) {
  const doc = await PDFDocument.create();
  const regular = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const accent = rgb(...data.accent);
  const page = doc.addPage([A4.width, A4.height]);

  page.drawRectangle({ x: 0, y: A4.height - 124, width: A4.width, height: 124, color: soft });
  page.drawText("FUTURISTIC VIBES 2026", { x: margin, y: A4.height - 52, font: bold, size: 21, color: dark });
  page.drawText(data.eventName, { x: margin, y: A4.height - 77, font: regular, size: 12, color: muted });
  page.drawRectangle({ x: margin, y: A4.height - 96, width: A4.width - margin * 2, height: 4, color: accent });

  page.drawText("NOMOR REGISTRASI", { x: margin, y: A4.height - 151, font: bold, size: 8, color: muted });
  page.drawText(data.regNumber, { x: margin, y: A4.height - 181, font: bold, size: 25, color: accent });

  let y = A4.height - 224;
  y = sectionTitle(page, "DATA PESERTA", y, bold, accent);
  y = detailGrid(page, [
    ["Nama", data.participant.name],
    ["No. HP / WA", data.participant.phone],
    ["Email", data.participant.email],
    ["Kategori", data.participant.category],
    ["Ukuran Jersey", data.participant.jerseySize],
    ["Jenis Sepeda", data.participant.bikeType],
    ["Kontak Darurat", data.participant.emergencyContactName],
    ["No. Darurat", data.participant.emergencyContactPhone],
  ], y, regular, bold) - 5;

  y = sectionTitle(page, "DETAIL ACARA", y, bold, accent);
  page.drawRectangle({ x: margin, y: y - 67, width: A4.width - margin * 2, height: 77, color: soft, borderColor: border, borderWidth: 0.7 });
  page.drawText("TANGGAL DAN JAM", { x: margin + 14, y: y - 12, font: bold, size: 7.5, color: muted });
  drawWrapped(page, data.eventDate, margin + 14, y - 28, { font: regular, size: 10, maxWidth: A4.width - margin * 2 - 28 });
  page.drawText("LOKASI START / FINISH", { x: margin + 14, y: y - 48, font: bold, size: 7.5, color: muted });
  drawWrapped(page, data.eventLocation, margin + 14, y - 63, { font: regular, size: 10, maxWidth: A4.width - margin * 2 - 28 });
  y -= 94;

  y = sectionTitle(page, "PEMBAYARAN", y, bold, accent);
  detailGrid(page, [
    ["Total Bayar", data.paymentAmount],
    ["Metode", data.paymentMethod],
    ["Status", data.paymentStatus],
  ], y, regular, bold);
  addFooter(page, regular, data.printedAt);

  const proofPage = doc.addPage([A4.width, A4.height]);
  proofPage.drawText("BUKTI PEMBAYARAN", { x: margin, y: A4.height - 54, font: bold, size: 18, color: dark });
  proofPage.drawText(`${data.eventName} - ${data.regNumber}`, { x: margin, y: A4.height - 76, font: regular, size: 10, color: muted });
  proofPage.drawRectangle({ x: margin, y: A4.height - 92, width: A4.width - margin * 2, height: 3, color: accent });

  const proofArea = { x: margin, y: 76, width: A4.width - margin * 2, height: A4.height - 190 };
  proofPage.drawRectangle({
    x: proofArea.x,
    y: proofArea.y,
    width: proofArea.width,
    height: proofArea.height,
    color: rgb(1, 1, 1),
    borderColor: border,
    borderWidth: 0.7,
  });
  if (data.proof.mimeType === "application/pdf") {
    const [embeddedPage] = await doc.embedPdf(data.proof.bytes, [0]);
    const scale = Math.min(proofArea.width / embeddedPage.width, proofArea.height / embeddedPage.height);
    const width = embeddedPage.width * scale;
    const height = embeddedPage.height * scale;
    proofPage.drawPage(embeddedPage, { x: proofArea.x + (proofArea.width - width) / 2, y: proofArea.y + (proofArea.height - height) / 2, width, height });
  } else {
    const image = data.proof.mimeType === "image/png"
      ? await doc.embedPng(data.proof.bytes)
      : await doc.embedJpg(data.proof.bytes);
    const scale = Math.min(proofArea.width / image.width, proofArea.height / image.height);
    const width = image.width * scale;
    const height = image.height * scale;
    proofPage.drawImage(image, { x: proofArea.x + (proofArea.width - width) / 2, y: proofArea.y + (proofArea.height - height) / 2, width, height });
  }
  addFooter(proofPage, regular, data.printedAt);

  return doc.save();
}
