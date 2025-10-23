import z from 'zod';

/**
 * @openapi
 * components:
 *   parameters:
 *     notificationId:
 *       name: notificationId
 *       in: path
 *       required: true
 *       description: Unique identifier of the notification.
 *       schema:
 *         type: string
 *         format: uuid
 *         example: "550e8400-e29b-41d4-a716-446655440000"
 */
export const notificationIdParamSchema = z.object({
  params: z.object({
    notificationId: z.string().uuid('Notification ID is not valid.'),
  }),
});

/**
 * @openapi
 * components:
 *   schemas:
 *     SendBatchInvitesRequest:
 *       type: object
 *       required:
 *         - emails
 *         - subject
 *         - message
 *         - linkUrl
 *         - inviterName
 *       properties:
 *         emails:
 *           type: array
 *           description: List of email addresses to send invites to.
 *           items:
 *             type: string
 *             format: email
 *             example: "user@example.com"
 *         subject:
 *           type: string
 *           description: Subject line for the invitation email.
 *           example: "You’re invited to join our platform!"
 *         message:
 *           type: string
 *           description: Body of the invitation message.
 *           example: "Hi there, join us today and enjoy exclusive benefits!"
 *         linkUrl:
 *           type: string
 *           description: URL included in the invitation email.
 *           format: uri
 *           example: "https://example.com/invite"
 *         inviterName:
 *           type: string
 *           description: Name of the person sending the invitation.
 *           example: "Alice Johnson"
 */
export const sendBatchInvitesSchema = z.object({
  body: z.object({
    emails: z.array(z.string().email('Invalid email address')),
    subject: z.string().min(1, 'Subject is required'),
    message: z.string().min(1, 'Message is required'),
    linkUrl: z.string().url('Invalid URL format'),
    inviterName: z.string().min(1, 'Inviter name is required'),
  }),
});

/**
 * @openapi
 * components:
 *   schemas:
 *     SendBulkInvitesRequest:
 *       type: object
 *       required:
 *         - contacts
 *         - subject
 *         - message
 *         - linkUrl
 *         - inviterName
 *       properties:
 *         contacts:
 *           type: array
 *           description: List of contacts to send invitations to.
 *           items:
 *             type: object
 *             required:
 *               - name
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *                 description: Full name of the contact.
 *                 example: "Jane Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email address of the contact.
 *                 example: "jane.doe@example.com"
 *         subject:
 *           type: string
 *           description: Subject line for the invitation email.
 *           example: "Join our new platform today!"
 *         message:
 *           type: string
 *           description: Body content of the invitation message.
 *           example: "We’re excited to invite you to our new platform. Click below to get started!"
 *         linkUrl:
 *           type: string
 *           format: uri
 *           description: The link to be included in the invitation.
 *           example: "https://example.com/invite"
 *         inviterName:
 *           type: string
 *           description: Name of the person sending the invite.
 *           example: "John Smith"
 */
export const sendBulkInvitesSchema = z.object({
  body: z.object({
    contacts: z
      .array(
        z.object({
          name: z.string().min(1, 'Contact name is required'),
          email: z.string().email('Invalid email address'),
        })
      )
      .nonempty('At least one contact is required'),
    subject: z.string().min(1, 'Subject is required'),
    message: z.string().min(1, 'Message is required'),
    linkUrl: z.string().url('Invalid URL format'),
    inviterName: z.string().min(1, 'Inviter name is required'),
  }),
});
