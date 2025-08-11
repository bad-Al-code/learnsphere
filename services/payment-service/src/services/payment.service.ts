import { v4 as uuidv4 } from 'uuid';

import { RazorpayClient } from '../clients/razorpay.client';
import logger from '../config/logger';
import { CourseRepository, PaymentRepository } from '../db/repostiories';
import { NotFoundError } from '../errors';
import { CreateOrderData, Requester } from '../types';

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
}
