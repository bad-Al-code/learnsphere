import Razorpay from 'razorpay';

import { env } from '../config/env';
import logger from '../config/logger';

export class RazorpayClient {
  private static instance: Razorpay;

  /**
   * @static
   * @method getInstance
   * @description Retrives the singelton instance of the Razonrpay SDK.
   * If an instance does not exist, it creates one.
   * @returns {Razorpay} The initialized Razorpay SDK instance.
   */
  public static getInstance(): Razorpay {
    if (!this.instance) {
      this.instance = new Razorpay({
        key_id: env.RAZORPAY_KEY_ID,
        key_secret: env.RAZORPAY_KEY_SECRET,
      });

      logger.info(`Razorpay SDK client initialized successfully.`);
    }

    return this.instance;
  }
}
