/**
 * A reusable layout component for all transactional emails.
 * Provides a consistent header, footer, and modern styling.
 * @param content - The main HTML content to be injected into the layout.
 * @returns A full HTML email string.
 */
export const EmailLayout = (content: string): string => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; background-color: #ffffff; margin: 0; padding: 0; }
            .container { width: 100%; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; }
            .header { text-align: center; padding-bottom: 20px; border-bottom: 1px solid #eaeaea; }
            .header h1 { font-size: 24px; color: #000000; font-weight: 600; }
            .content { padding: 30px 0; color: #333333; font-size: 16px; line-height: 1.5; }
            .button { display: inline-block; padding: 12px 24px; background-color: #000000; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 500; }
            .footer { text-align: center; padding-top: 20px; border-top: 1px solid #eaeaea; font-size: 12px; color: #999999; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>LearnSphere</h1>
            </div>
            <div class="content">
                ${content}
            </div>
            <div class="footer">
                <p>© ${new Date().getFullYear()} LearnSphere. All rights reserved.</p>
                <p>If you did not request this email, you can safely ignore it.</p>
            </div>
        </div>
    </body>
    </html>
  `;
};
