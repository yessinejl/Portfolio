import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json();

    // Validation basique
    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: 'Champs requis manquants' },
        { status: 400 }
      );
    }

    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    // Vérification des variables d'environnement
    if (!smtpHost || !smtpPort || !smtpUser || !smtpPass) {
      console.warn(
        "Avertissement : Les variables de configuration SMTP ne sont pas encore définies dans .env.local. " +
        "L'e-mail n'a pas été envoyé."
      );
      return NextResponse.json(
        { 
          success: false, 
          error: 'Configuration SMTP manquante sur le serveur.' 
        },
        { status: 500 }
      );
    }

    // Configurer le transporteur de courriels (SMTP)
    // Gestion intelligente pour Gmail et contournement des restrictions de certificat locales
    const transporter = nodemailer.createTransport(
      smtpHost.includes('gmail.com')
        ? {
            service: 'gmail',
            auth: {
              user: smtpUser,
              pass: smtpPass,
            },
            tls: {
              rejectUnauthorized: false,
            },
          }
        : {
            host: smtpHost,
            port: parseInt(smtpPort),
            secure: smtpPort === '465', // true pour 465, false pour 587
            auth: {
              user: smtpUser,
              pass: smtpPass,
            },
            tls: {
              rejectUnauthorized: false,
            },
          }
    );

    const destinataire = 'yacinejlassia@gmail.com';

    // Contenu HTML du courriel avec style moderne
    const htmlTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f8fafc;
            color: #0f172a;
            margin: 0;
            padding: 20px;
          }
          .card {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
          }
          .header {
            background: linear-gradient(135deg, #2563eb, #4f46e5);
            padding: 28px 24px;
            text-align: center;
            color: #ffffff;
          }
          .header h2 {
            margin: 0;
            font-size: 20px;
            font-weight: 700;
            letter-spacing: -0.025em;
          }
          .content {
            padding: 32px 24px;
          }
          .field {
            margin-bottom: 24px;
          }
          .label {
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #64748b;
            margin-bottom: 6px;
            display: block;
          }
          .value {
            font-size: 15px;
            color: #0f172a;
            line-height: 1.5;
            font-weight: 500;
          }
          .message-box {
            background: #f8fafc;
            border: 1px solid #f1f5f9;
            padding: 16px;
            border-radius: 12px;
            font-size: 14px;
            color: #334155;
            line-height: 1.6;
            white-space: pre-wrap;
            margin-top: 6px;
          }
          .footer {
            text-align: center;
            font-size: 11px;
            color: #94a3b8;
            padding: 20px;
            border-top: 1px solid #f1f5f9;
            background: #fafafa;
          }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <h2>Nouveau Message de Contact</h2>
          </div>
          <div class="content">
            <div class="field">
              <span class="label">Nom Complet</span>
              <span class="value">${name}</span>
            </div>
            <div class="field">
              <span class="label">Adresse E-mail</span>
              <span class="value">
                <a href="mailto:${email}" style="color: #2563eb; text-decoration: none; font-weight: 600;">${email}</a>
              </span>
            </div>
            <div class="field">
              <span class="label">Message</span>
              <div class="message-box">${message}</div>
            </div>
          </div>
          <div class="footer">
            Cet e-mail de notification a été envoyé automatiquement depuis votre site Portfolio.
          </div>
        </div>
      </body>
      </html>
    `;

    // Envoyer l'e-mail
    await transporter.sendMail({
      from: `"Portfolio Contact" <${smtpUser}>`,
      to: destinataire,
      replyTo: email,
      subject: `📧 Nouveau message de ${name} sur votre Portfolio`,
      html: htmlTemplate,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Erreur lors de l'envoi de la notification e-mail :", error);
    return NextResponse.json(
      { success: false, error: error.message || "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
