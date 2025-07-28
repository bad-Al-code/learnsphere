import { EmailButton, EmailLayout } from './EmailLayout';

/**
 * Generates the HTML for the email verification email with a 6-digit code.
 * @param verificationCode - The 6-digit code.
 * @param verificationLink - The unique fallback link.
 * @returns The full, styled HTML email string.
 */
export const generateVerificationEmail = (
  verificationCode: string,
  verificationLink: string
): string => {
  const content = `
    <p>Hello,</p>
    <p>Thank you for signing up for LearnSphere! Use the code below to verify your email address.</p>
    <div style="text-align: center; margin: 30px 0; background-color: #f4f4f4; padding: 20px; border-radius: 8px;">
        <p style="font-size: 32px; font-weight: bold; letter-spacing: 8px; margin: 0;">${verificationCode}</p>
    </div>
    <p>This verification code will expire in 10 minutes.</p>
    <hr style="border: none; border-top: 1px solid #eaeaea; margin: 26px 0;" />
    <p style="font-size: 12px; color: #666666;">If you're having trouble with the code, you can also verify by clicking the button below:</p>
    <p style="text-align: center; margin: 20px 0;">
      ${EmailButton(verificationLink, 'Verify with Link Instead')}
    </p>
    <p>Welcome aboard,<br>The LearnSphere Team</p>
  `;

  return EmailLayout(content);
};
