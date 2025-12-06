import { Injectable, Logger } from "@nestjs/common";
import { Resend } from "resend";

@Injectable()
export class MailService {
  private readonly resend: Resend;
  private readonly logger = new Logger(MailService.name);

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async sendPasswordEmail(to: string, password: string) {
    const from = process.env.FROM_EMAIL || "Acme <onboarding@resend.dev>";

    const result = await this.resend.emails.send({
      from,
      to,
      subject: "Sua senha temporária",
      html: `
        <h3>Sua conta foi criada!</h3>
        <p>Sua senha temporária é:</p>
        <p style="font-size:20px;font-weight:bold;">${password}</p>
      `,
    });

    this.logger.log(`Email enviado para ${to}`);

    return result;
  }
}
