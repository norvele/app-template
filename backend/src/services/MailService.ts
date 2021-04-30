import { Transporter, createTransport } from "nodemailer";

interface Config {
  host: string;
  port: number;
  user: string;
  password: string;
  from: string;
}

export class MailService {
  private config: Config;
  private transporter: Transporter;

  constructor(config: Config) {
    this.config = config;
    this.transporter = createTransport({
      host: config.host,
      port: config.port,
      secure: false,
      auth: {
        user: config.user,
        pass: config.password,
      },
    });
  }

  async sendEmailVerify(
    email: string,
    { code }: { code: string }
  ): Promise<void> {
    await this.transporter.sendMail({
      from: this.config.from,
      to: email,
      subject: "Email verify",
      text: `Code: ${code}`,
    });
  }

  async sendChangePasswordCode(
    email: string,
    { code }: { code: string }
  ): Promise<void> {
    await this.transporter.sendMail({
      from: this.config.from,
      to: email,
      subject: "Change password",
      text: `Code: ${code}`,
    });
  }
}
