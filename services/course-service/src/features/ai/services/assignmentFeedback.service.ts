import { AssignmentFeedbackRepository } from '../respository/assignmentFeedback.repository';

export class AIFeedbackService {
  public static async getFeedbackForUser(userId: string) {
    return AssignmentFeedbackRepository.findFeedbackByUserId(userId);
  }
}
