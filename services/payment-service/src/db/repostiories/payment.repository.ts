import { db } from '..';
import { NewPayment } from '../../types';
import { payments } from '../schema';

export class PaymentRepository {
  /**
   * Creates a new payment record.
   * @param data - The data for the new payment.
   * @returns The newly created payment object.
   */
  public static async create(data: NewPayment) {
    const [newPayment] = await db.insert(payments).values(data).returning();
    return newPayment;
  }
}
