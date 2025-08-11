import crypto, { timingSafeEqual } from 'node:crypto';
import { v4 as uuidv4 } from 'uuid';

import { RazorpayClient } from '../clients/razorpay.client';
import { env } from '../config/env';
import logger from '../config/logger';
import { CourseRepository, PaymentRepository } from '../db/repostiories';
import { BadRequestError, NotFoundError } from '../errors';
import { PaymentSuccessfulPublisher } from '../events/publisher';
import { CreateOrderData, Payment, Requester, WebhookEvent } from '../types';

export class PaymentService {
  /**
   * Creates a payment order with Razorpay and logs it in the database.
   * @param data - Contains the courseId for which the payment is being made.
   * @param requester - The user initiating the payment.
   * @returns An object containing the Razorpay order details.
   */
  public static async createOrder(data: CreateOrderData, requester: Requester) {
    const { courseId } = data;
    const userId = requester.id;

    logger.info(
      `Initializing order creation for course ${courseId} by user ${userId}`
    );

    const course = await CourseRepository.findById(courseId);
    if (!course || !course.price) {
      throw new NotFoundError('Course with a valid price not found.');
    }

    const amountInPaise = Math.round(parseFloat(course.price) * 100);
    const currency = course.currency || 'INR';
    const receiptId = `receipt_order_${uuidv4()}`;

    const options = {
      amount: amountInPaise,
      currency: currency,
      receipt: receiptId,
      notes: {
        userId,
        courseId,
      },
    };

    const razorpay = RazorpayClient.getInstance();
    const order = await razorpay.orders.create(options);

    await PaymentRepository.create({
      userId,
      courseId,
      amount: course.price,
      currency: order.currency,
      status: 'pending',
      razorpayOrderId: order.id,
    });

    logger.info(
      `Razonrpay order ${order.id} created and pending payment logged for user ${userId}`
    );

    return {
      orderId: order.id,
      amound: order.amount,
      currency: order.currency,
    };
  }

  /**
   * Verifies a Razorpay webhook signature and processes the payment event.
   * @param event - The webhook payload from Razorpay.
   * @param signature - The signature sent in the request header.
   * @param rawBody - The raw, unparsed request body.
   * @returns The updated payment record from the database.
   */
  public static async handleWebhook(
    event: WebhookEvent,
    signature: string,
    rawBody: string
  ): Promise<Payment | undefined> {
    logger.info(`Received Razorpay webhook for event: ${event.event}`);

    const isValid = this.verifySignature(rawBody, signature);
    if (!isValid) {
      throw new BadRequestError('Invalid Razorpay webhook signature.');
    }

    if (event.event === 'payment.captured') {
      const paymentEntity = event.payload.payment.entity;
      const orderId = paymentEntity.order_id;
      logger.info(`Processing successful payment for order_id: ${orderId}`);

      const paymentRecord =
        await PaymentRepository.findByRazorpayOrderId(orderId);

      if (!paymentRecord) {
        logger.error(
          `Webhook received for an unknown order_id: ${orderId}. Potentially suspicious.`
        );

        return undefined;
      }

      if (paymentRecord.status === 'completed') {
        logger.warn(
          `Webhook received for an already completed payment: ${paymentRecord.id}. Ignoring.`
        );

        return paymentRecord;
      }

      const updatedPayment = await PaymentRepository.update(paymentRecord.id, {
        status: 'completed',
        razorpayPaymentId: paymentEntity.id,
        razorpaySignature: signature,
      });

      logger.info(`Payment record ${updatedPayment.id} marked as completed.`);

      try {
        const publisher = new PaymentSuccessfulPublisher();
        await publisher.publish({
          paymentId: updatedPayment.id,
          userId: updatedPayment.id,
          courseId: updatedPayment.courseId,
          amount: updatedPayment.amount,
          currency: updatedPayment.currency,
          completedAt: updatedPayment.updatedAt,
        });
      } catch (error) {
        logger.error(
          `Failed to publish payment.successful event for paymentId: ${updatedPayment.id}`,
          { error }
        );
      }

      return updatedPayment;
    } else if (event.event === 'payment.failed') {
      const paymentEntity = event.payload.payment.entity;
      const orderId = paymentEntity.order_id;
      logger.warn(`Payment failed for order_id: ${orderId}`);

      const paymentRecord =
        await PaymentRepository.findByRazorpayOrderId(orderId);

      if (paymentRecord && paymentRecord.status !== 'completed') {
        await PaymentRepository.update(paymentRecord.id, {
          status: 'failed',
        });
      }
    } else {
      logger.info(`Ignoring unhandled Razorpay event type: ${event.event}`);
    }

    return undefined;
  }

  /**
   * Verifies the signature of an incoming webhook request from Razorpay.
   * @param rawBody The raw string body of the request.
   * @param signature The 'X-Razorpay-Signature' header value.
   * @returns True if the signature is valid, false otherwise.
   */
  private static verifySignature(rawBody: string, signature: string): boolean {
    const secret = env.RAZORPAY_WEBHOOK_SECRET;

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(rawBody)
      .digest('hex');

    const signatureBuffer = Buffer.from(signature, 'utf-8');
    const expectedSignatureBuffer = Buffer.from(expectedSignature, 'utf-8');

    if (signatureBuffer.length !== expectedSignatureBuffer.length) {
      return false;
    }

    return timingSafeEqual(expectedSignatureBuffer, signatureBuffer);
  }
}
