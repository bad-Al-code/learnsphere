import * as admin from 'firebase-admin';
import logger from '../config/logger';

export class PushClient {
  private isInitialized: boolean = false;

  constructor() {
    try {
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
      });

      this.isInitialized = true;

      logger.info(`Firebase Admin SDK initialized successfully.`);
    } catch (error) {
      logger.error(`Failed to initialize Firebase Admin SDK`, { error });
    }
  }

  /**
   * Sends a notification to one or more device tokens.
   * @param tokens An array of FCM devices token.
   * @param title The title of the notification.
   * @param body The body text of the notification.
   * @param linkUrl An optional URL to open where the notification is tapped.
   */
  public async send(
    tokens: string[],
    title: string,
    body: string,
    linkUrl?: string
  ): Promise<void> {
    if (!this.isInitialized || tokens.length === 0) {
      if (tokens.length === 0)
        logger.warn(`PushClient.send called with no tokens. Skipping.`);

      return;
    }

    const message: admin.messaging.MulticastMessage = {
      tokens,
      notification: {
        title,
        body,
      },
      webpush: {
        fcmOptions: {
          link: linkUrl || 'http://localhost:3000',
        },
      },
    };

    try {
      const response = await admin.messaging().sendEachForMulticast(message);

      logger.info(
        `Successfully sent ${response.successCount} push notifications.`
      );

      if (response.failureCount > 0) {
        logger.warn(
          `Failed to send ${response.failureCount} push notifications.`
        );
      }
    } catch (error) {
      logger.error(`Error sending push notifications via FCM`, { error });
    }
  }
}
