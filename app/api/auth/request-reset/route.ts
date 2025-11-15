import { NextRequest, NextResponse } from 'next/server';
import { upstashRedis } from '@/lib/server/redis';
import crypto from 'crypto';
import { Resend } from 'resend';

export const maxDuration = 40;

export async function POST(request: NextRequest) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Check if user exists with this email
    const userId = await upstashRedis.get<string>(`user:email:${email.toLowerCase()}`);
    
    if (!userId) {
      // Don't reveal if email exists or not for security
      return NextResponse.json({ 
        message: 'If an account exists with this email, you will receive a password reset link.' 
      });
    }

    // Check if user has credentials (not a Google OAuth user)
    const credentials = await upstashRedis.get(`user:credentials:${userId}`);
    
    if (!credentials) {
      // User signed up with Google, can't reset password
      return NextResponse.json({ 
        message: 'Looks like you signed up via Google. Try using the "Sign in with Google" button.' 
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    // Store reset token in Redis
    await upstashRedis.set(
      `password-reset:${resetToken}`,
      { userId, email: email.toLowerCase(), expiresAt: resetTokenExpiry },
      { ex: 86400 } // 24 hours in seconds
    );

    // Get user profile for name
    const profile = await upstashRedis.get<{ name?: string }>(`user:profile:${userId}`);
    const userName = profile?.name || 'there';

    // Send email directly
    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password/confirm?token=${resetToken}`;
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Ubuntu, sans-serif; background-color: #f6f9fc; margin: 0; padding: 0;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 45px 20px 40px;">
            <h1 style="color: #000000; font-size: 24px; font-weight: 600; line-height: 40px; margin: 0 0 20px;">Hey ${userName}!</h1>
            
            <p style="color: #000000; font-size: 16px; line-height: 26px; margin: 0 0 16px;">
              <strong>Forgot your password? Don't worry, it happens to the best of us... 🙂</strong>
            </p>

            <p style="color: #000000; font-size: 16px; line-height: 26px; margin: 0 0 16px;">
              To reset your password, click the button below. The link will self-destruct after 24h.
            </p>

            <div style="padding: 27px 0;">
              <a href="${resetUrl}" style="background-color: #7C88FF; border-radius: 8px; color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; text-align: center; display: block; padding: 14px 20px;">
                ✨ Reset my Password
              </a>
            </div>

            <p style="color: #000000; font-size: 14px; font-style: italic; line-height: 24px; margin: 16px 0 0;">
              <em>If you do not want to change your password or didn't request a reset, you can ignore and delete this email.</em>
            </p>
          </div>
        </body>
      </html>
    `;

    try {
      const { error: emailError } = await resend.emails.send({
        from: 'Portfoliofy <noreply@portfoliofy.me>',
        to: [email.toLowerCase()],
        subject: 'Forgot your password?',
        html: htmlContent,
      });

      if (emailError) {
        console.error('Resend error:', emailError);
        // Still return success message for security (don't reveal if email exists)
        return NextResponse.json({ 
          message: 'If an account exists with this email, you will receive a password reset link.' 
        });
      }
    } catch (emailErr) {
      console.error('Email send error:', emailErr);
      // Still return success message for security
      return NextResponse.json({ 
        message: 'If an account exists with this email, you will receive a password reset link.' 
      });
    }

    return NextResponse.json({ 
      message: 'If an account exists with this email, you will receive a password reset link.' 
    });
  } catch (error) {
    console.error('Reset password request error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
