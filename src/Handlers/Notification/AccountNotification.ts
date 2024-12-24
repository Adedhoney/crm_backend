import { Notification } from '@infrastructure/Notification';

export interface IforgotPasswordEmail {
    to: string;
    otp: string;
    fullName: string;
}

export interface IAccountNotification {
    sendInvite(to: string, inviteId: string, from?: string): Promise<void>;
    forgotPasswordEmail(
        to: string,
        otp: string,
        firstName: string,
    ): Promise<void>;
}

export class AccountNotification
    extends Notification
    implements IAccountNotification
{
    async sendInvite(
        to: string,
        inviteId: string,
        from: string = 'BusyRooms CRM',
    ): Promise<void> {
        try {
            const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Invitation Email</title>
<style>
  body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
    background-color: #f4f4f7;
    color: #333333;
  }
  .email-container {
    max-width: 600px;
    margin: 0 auto;
    background: #ffffff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  }
  .email-header {
    text-align: center;
    margin-bottom: 20px;
  }
  .email-header img {
    max-width: 150px;
  }
  .email-body {
    padding: 20px;
    line-height: 1.6;
  }
  .email-body h2 {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
  }
  .email-body p {
    margin: 0 0 15px;
  }
  .accept-button {
    display: inline-block;
    background-color: #000000;
    color: #ffffff;
    text-decoration: none;
    padding: 10px 20px;
    border-radius: 15px;
    font-weight: bold;
    text-align: center;
    margin-top: 20px;
  }
  .email-footer {
    margin-top: 20px;
    text-align: center;
    font-size: 12px;
    color: #888888;
    border-top: 1px solid #eeeeee;
    padding-top: 20px;
  }
  .email-footer a {
    color: #007bff;
    text-decoration: none;
  }
  .social-icons img {
    max-width: 24px;
    margin: 0 5px;
  }
</style>
</head>
<body>
<div class="email-container">
  <div class="email-header">
    <img src="https://via.placeholder.com/150x50?text=Logoipsum" alt="Logo" />
  </div>
  <div class="email-body">
    <h2>You’re Invited to Martha’s Team.</h2>
    <p>Hello,</p>
    <p>
      ${from} has invited you to join Samphes Services admin dashboard as
      an Admin. Accept the invitation to start working together.
    </p>
    <p>This invite only lasts for 7 days.</p>
    <p>Your invite Id is ${inviteId}</p>
    <a href="http://localhost:5173/auth/accept-invite/${inviteId}" class="accept-button">Accept invitation</a>
  </div>
  <div class="email-footer">
    <p>
      Need help? <a href="#">Contact our support team</a> or no longer
      interested in our newsletters? <a href="#">Unsubscribe here</a>. Want
      to give us feedback? Let us know what you think on our
      <a href="#">feedback site</a>.
    </p>
    <div class="social-icons">
      <a href="#"><img src="https://via.placeholder.com/24?text=FB" alt="Facebook" /></a>
      <a href="#"><img src="https://via.placeholder.com/24?text=TW" alt="Twitter" /></a>
      <a href="#"><img src="https://via.placeholder.com/24?text=IN" alt="LinkedIn" /></a>
      <a href="#"><img src="https://via.placeholder.com/24?text=IG" alt="Instagram" /></a>
    </div>
  </div>
</div>
</body>
</html>

    `;

            const params = {
                to,
                message: '',
                subject: 'Admin Invite',
                text: 'Samphes admin Invite',
                html: html,
            };

            await this.email(params);
        } catch (err) {
            throw new Error((err as Error).message);
        }
    }
    public async forgotPasswordEmail(
        to: string,
        otp: string,
        firstName: string,
    ): Promise<void> {
        try {
            const html = `
     <!DOCTYPE html>
                  <html>
                    <head>
                      <meta charset="UTF-8" />
                      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                      <title>Password Reset OTP</title>
                      <style>
                        body {
                          font-family: Arial, sans-serif;
                          margin: 0;
                          padding: 0;
                          background-color: #f4f4f7;
                          color: #333333;
                        }
                        .email-container {
                          max-width: 600px;
                          margin: 0 auto;
                          background: #ffffff;
                          padding: 20px;
                          border-radius: 8px;
                          box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
                        }
                        .email-header {
                          text-align: center;
                          margin-bottom: 20px;
                        }
                        .email-header img {
                          max-width: 150px;
                        }
                        .email-body {
                          padding: 20px;
                          line-height: 1.6;
                        }
                        .otp-code {
                          font-size: 20px;
                          font-weight: bold;
                          color: #000000;
                        }
                        .email-footer {
                          margin-top: 20px;
                          text-align: center;
                          font-size: 12px;
                          color: #888888;
                          border-top: 1px solid #eeeeee;
                          padding-top: 20px;
                        }
                        .email-footer a {
                          color: #007bff;
                          text-decoration: none;
                        }
                        .social-icons img {
                          max-width: 24px;
                          margin: 0 5px;
                        }
                      </style>
                    </head>
                    <body>
                      <div class="email-container">
                        <div class="email-header">
                          <img src="https://via.placeholder.com/150x50?text=Logoipsum" alt="Logo" />
                        </div>
                        <div class="email-body">
                          <h2>Password Reset OTP</h2>
                          <p>Hey ${firstName},</p>
                          <p>
                            You recently requested to reset your password for your Samphes account
                            account. To reset your password, use the following code:
                          </p>
                          <p class="otp-code">OTP Token: ${otp}</p>
                          <p>
                            This code expires in 5 minutes. If you did not initiate this action,
                            ignore this mail, it is likely someone mistakenly inputed your email.
                          </p>
                          <p>Best regards,</p>
                          <p>Samphes Team</p>
                        </div>
                        <div class="email-footer">
                          <p>
                            Need help? <a href="#">Contact our support team</a> or no longer
                            interested in our newsletters? <a href="#">Unsubscribe here</a>. Want
                            to give us feedback? Let us know what you think on our
                            <a href="#">feedback site</a>.
                          </p>
                          <div class="social-icons">
                            <a href="#"><img src="https://via.placeholder.com/24?text=FB" alt="Facebook" /></a>
                            <a href="#"><img src="https://via.placeholder.com/24?text=TW" alt="Twitter" /></a>
                            <a href="#"><img src="https://via.placeholder.com/24?text=IN" alt="LinkedIn" /></a>
                            <a href="#"><img src="https://via.placeholder.com/24?text=IG" alt="Instagram" /></a>
                          </div>
                        </div>
                      </div>
                    </body>
                  </html>
            `;

            const params = {
                to,
                message: '',
                subject: 'Password Reset',
                text: 'Use this OTP for your password reset',
                html: html,
            };

            await this.email(params);
        } catch (err) {
            throw new Error((err as Error).message);
        }
    }
}
