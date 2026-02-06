import nodemailer from "nodemailer";

export type DailyDigestItem = {
  title: string;
  url: string;
};

export type SendDailyDigestInput = {
  to: string;
  subject: string;
  posts: DailyDigestItem[];
};

export type SendResult = {
  provider: "smtp";
  messageId: string;
};

export interface EmailSender {
  sendDailyDigest(input: SendDailyDigestInput): Promise<SendResult>;
}

export type SmtpEmailSenderConfig = {
  from: string;
  host: string;
  port: number;
  user: string;
  pass: string;
  secure: boolean;
};

export class SmtpEmailSender implements EmailSender {
  private readonly from: string;
  private readonly transporter: nodemailer.Transporter;

  constructor(config: SmtpEmailSenderConfig) {
    this.from = config.from;
    this.transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      auth: {
        user: config.user,
        pass: config.pass
      },
      secure: config.secure
    });
  }

  async sendDailyDigest(input: SendDailyDigestInput): Promise<SendResult> {
    const htmlList = input.posts
      .map((post) => `<li><a href="${post.url}">${post.title}</a></li>`)
      .join("");

    const info = await this.transporter.sendMail({
      from: this.from,
      to: input.to,
      subject: input.subject,
      html: `<h1>DailyRead</h1><ul>${htmlList}</ul>`
    });

    return {
      provider: "smtp",
      messageId: info.messageId
    };
  }
}
