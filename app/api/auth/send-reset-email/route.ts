import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { email, resetUrl, userName } = await request.json();

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Ubuntu, sans-serif; background-color: #f6f9fc; margin: 0; padding: 0;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 45px 20px 40px;">
            <h1 style="color: #000000; font-size: 24px; font-weight: 600; line-height: 40px; margin: 0 0 20px;">Hey ${userName || 'there'}!</h1>
            
            <p style="color: #000000; font-size: 16px; line-height: 26px; margin: 0 0 16px;">
              <strong>Forgot your password? Don't worry, it happens to the best of us... 🙂</strong>
            </p>

            <p style="color: #000000; font-size: 16px; line-height: 26px; margin: 0 0 16px;">
              To reset your password, click the button below. The link will self-destruct after 24h.
            </p>

            <div style="padding: 27px 0;">
              <a href="${resetUrl}" style="background-color: #7C88FF; border-radius: 8px; color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; text-align: center; display: block; padding: 14px 20px;">
                ✨✨ Reset my Password
              </a>
            </div>

            <p style="color: #000000; font-size: 14px; font-style: italic; line-height: 24px; margin: 16px 0 0;">
              <em>If you do not want to change your password or didn't request a reset, you can ignore and delete this email.</em>
            </p>
          </div>
        </body>
      </html>
    `;

    const { data, error } = await resend.emails.send({
      from: 'Portfoliofy <noreply@portfoliofy.me>',
      to: [email],
      subject: 'Forgot your password?',
      html: htmlContent,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Email send error:', error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
