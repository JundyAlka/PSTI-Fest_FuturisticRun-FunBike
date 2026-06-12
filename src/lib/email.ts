import { Resend } from "resend";
import { formatCurrency, CATEGORY_LABELS } from "./utils";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

function mockEmail(to: string, subject: string, html: string) {
  void html;
  console.log(`\n📧 [MOCK EMAIL] To: ${to}`);
  console.log(`   Subject: ${subject}`);
  console.log(`   (Set RESEND_API_KEY in .env.local to send real emails)\n`);
}

export async function sendRegistrationEmail({
  to,
  name,
  regNumber,
  category,
  amount,
  paymentMethod,
}: {
  to: string;
  name: string;
  regNumber: string;
  category: string;
  amount: number;
  paymentMethod: string;
}) {
  const subject = `Pendaftaran Berhasil — ${regNumber} | Futuristic RUN 2026`;
  const html = `
    <div style="font-family: Arial, sans-serif; background: #0A0E27; color: #fff; padding: 32px; border-radius: 12px;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #00E5FF; font-size: 24px;">⚡ FUTURISTIC RUN 2026</h1>
        <p style="color: #B0C4DE;">Run The Future · Shine The Night</p>
      </div>
      <div style="background: #0F1535; border: 1px solid rgba(0,229,255,0.2); border-radius: 8px; padding: 20px; margin-bottom: 20px;">
        <h2 style="color: #ffffff; margin: 0 0 16px;">✅ Pendaftaran Berhasil!</h2>
        <p style="color: #B0C4DE;">Halo <strong style="color:#fff">${name}</strong>,</p>
        <p style="color: #B0C4DE;">Pendaftaran Anda telah diterima. Berikut detail pendaftaran Anda:</p>
        <table style="width:100%; border-collapse: collapse; margin-top: 12px;">
          <tr><td style="color:#B0C4DE; padding: 6px 0;">Nomor Registrasi</td><td style="color:#00E5FF; font-weight:bold;">${regNumber}</td></tr>
          <tr><td style="color:#B0C4DE; padding: 6px 0;">Nama</td><td style="color:#fff;">${name}</td></tr>
          <tr><td style="color:#B0C4DE; padding: 6px 0;">Kategori</td><td style="color:#fff;">${CATEGORY_LABELS[category] ?? category}</td></tr>
          <tr><td style="color:#B0C4DE; padding: 6px 0;">Biaya</td><td style="color:#FFD700; font-weight:bold;">${formatCurrency(amount)}</td></tr>
          <tr><td style="color:#B0C4DE; padding: 6px 0;">Metode Bayar</td><td style="color:#fff;">${paymentMethod.toUpperCase()}</td></tr>
        </table>
      </div>
      <div style="background: rgba(255,140,0,0.1); border: 1px solid rgba(255,140,0,0.3); border-radius: 8px; padding: 16px; margin-bottom: 20px;">
        <h3 style="color: #FF8C00; margin: 0 0 8px;">⚡ Langkah Selanjutnya</h3>
        <ol style="color: #B0C4DE; margin: 0; padding-left: 20px;">
          <li>Selesaikan pembayaran dalam 1×24 jam</li>
          <li>Upload bukti pembayaran di website</li>
          <li>Tunggu verifikasi dari panitia (1×24 jam kerja)</li>
          <li>Ambil Race Pack 20–21 Juni 2026</li>
          <li>Hadir dan berlari pada 22 Juni 2026! 🏁</li>
        </ol>
      </div>
      <p style="color:#B0C4DE; text-align:center; font-size:12px;">
        © 2026 PSTI FEST — Futuristic RUN · info@pstifest.com
      </p>
    </div>
  `;

  if (!resend) {
    mockEmail(to, subject, html);
    return;
  }
  await resend.emails.send({
    from: process.env.EMAIL_FROM ?? "noreply@pstifest.com",
    to,
    subject,
    html,
  });
}

export async function sendVerificationEmail({
  to,
  name,
  regNumber,
  category,
  bibNumber,
}: {
  to: string;
  name: string;
  regNumber: string;
  category: string;
  bibNumber: number | null;
}) {
  const subject = `Pembayaran Terverifikasi — BIB #${bibNumber} | Futuristic RUN 2026`;
  const html = `
    <div style="font-family: Arial, sans-serif; background: #0A0E27; color: #fff; padding: 32px; border-radius: 12px;">
      <h1 style="color: #00E5FF; text-align:center;">⚡ FUTURISTIC RUN 2026</h1>
      <div style="background: #0F1535; border: 1px solid rgba(0,229,255,0.3); border-radius: 8px; padding: 20px;">
        <h2 style="color: #00E5FF;">✅ Pembayaran Terverifikasi!</h2>
        <p style="color: #B0C4DE;">Halo <strong style="color:#fff">${name}</strong>, pembayaran Anda telah diverifikasi oleh panitia.</p>
        <table style="width:100%; border-collapse: collapse; margin-top: 12px;">
          <tr><td style="color:#B0C4DE; padding: 6px 0;">Nomor Registrasi</td><td style="color:#00E5FF;">${regNumber}</td></tr>
          <tr><td style="color:#B0C4DE; padding: 6px 0;">Kategori</td><td style="color:#fff;">${CATEGORY_LABELS[category] ?? category}</td></tr>
          ${bibNumber ? `<tr><td style="color:#B0C4DE; padding: 6px 0;">Nomor BIB</td><td style="color:#FFD700; font-weight:bold; font-size:20px;">#${bibNumber}</td></tr>` : ""}
        </table>
        <p style="color:#B0C4DE; margin-top:16px;">Jangan lupa ambil Race Pack pada <strong style="color:#fff">20–21 Juni 2026</strong>. Sampai jumpa pada hari H! 🏁</p>
      </div>
      <p style="color:#B0C4DE; text-align:center; font-size:12px; margin-top:16px;">© 2026 PSTI FEST — Futuristic RUN</p>
    </div>
  `;

  if (!resend) { mockEmail(to, subject, html); return; }
  await resend.emails.send({
    from: process.env.EMAIL_FROM ?? "noreply@pstifest.com",
    to, subject, html,
  });
}

export async function sendRejectionEmail({
  to, name, regNumber, notes,
}: {
  to: string; name: string; regNumber: string; notes?: string;
}) {
  const subject = `Pembayaran Ditolak — ${regNumber} | Futuristic RUN 2026`;
  const html = `
    <div style="font-family: Arial, sans-serif; background: #0A0E27; color: #fff; padding: 32px; border-radius: 12px;">
      <h1 style="color: #00E5FF; text-align:center;">⚡ FUTURISTIC RUN 2026</h1>
      <div style="background: #0F1535; border: 1px solid rgba(255,0,110,0.3); border-radius: 8px; padding: 20px;">
        <h2 style="color: #FF006E;">❌ Pembayaran Ditolak</h2>
        <p style="color: #B0C4DE;">Halo <strong style="color:#fff">${name}</strong>, maaf pembayaran Anda (${regNumber}) tidak dapat diverifikasi.</p>
        ${notes ? `<p style="color:#FF8C00;"><strong>Alasan:</strong> ${notes}</p>` : ""}
        <p style="color: #B0C4DE;">Silakan upload ulang bukti pembayaran yang valid melalui website kami.</p>
      </div>
    </div>
  `;
  if (!resend) { mockEmail(to, subject, html); return; }
  await resend.emails.send({
    from: process.env.EMAIL_FROM ?? "noreply@pstifest.com",
    to, subject, html,
  });
}
