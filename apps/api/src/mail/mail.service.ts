import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
    private transporter: nodemailer.Transporter;

    constructor() {
        const config: any = {
            host: process.env.MAIL_HOST,
            port: Number(process.env.MAIL_PORT),
            secure: false, // Mailhog doesn't use TLS
            logger: true,
            debug: true,
        };

        // Only add auth if credentials are provided
        if (process.env.MAIL_USER && process.env.MAIL_PASS) {
            config.auth = {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            };
        }

        this.transporter = nodemailer.createTransport(config);
    }

    async sendPasswordResetEmail(email: string, code: string) {
        const mailOptions = {
            from: process.env.MAIL_FROM || '"EpiTrello Support" <noreply@epitrello.com>',
            to: email,
            subject: 'Réinitialisation de votre mot de passe - EpiTrello',
            html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h1 style="color: #0079bf;">Réinitialisation de mot de passe</h1>
          <p>Bonjour,</p>
          <p>Vous avez demandé la réinitialisation de votre mot de passe sur EpiTrello.</p>
          <p>Voici votre code de vérification :</p>
          <div style="background-color: #f4f5f7; padding: 15px; border-radius: 5px; text-align: center; font-size: 24px; letter-spacing: 5px; font-weight: bold; margin: 20px 0;">
            ${code}
          </div>
          <p>Ce code est valide pour les 15 prochaines minutes.</p>
          <p>Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email.</p>
          <p>Cordialement,<br/>L'équipe EpiTrello</p>
        </div>
      `,
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log('Message sent: %s', info.messageId);
            return info;
        } catch (error) {
            console.error('Error sending email:', error);
            // En dev, on ne veut peut-être pas bloquer si le mail ne part pas,
            // mais en prod c'est critique. Pour l'instant on log juste l'erreur.
            throw error;
        }
    }
}
