import { Router } from 'express';

import { CertificateController } from '../controllers';
import { requireAuth, validateRequest } from '../middlewares';
import { getCertificatesQuerySchema } from '../schema';
const router = Router();

/**
 * @openapi
 * /api/enrollments/my-certificates:
 *   get:
 *     summary: "[Student] Get my certificates"
 *     tags: [Certificates]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         schema: { type: string }
 *         description: Search by course title.
 *       - in: query
 *         name: tag
 *         schema: { type: string }
 *         description: Filter by a specific skill/tag.
 *       - in: query
 *         name: sortBy
 *         schema: { type: string, enum: [date-desc, date-asc, title-asc, title-desc], default: 'date-desc' }
 *       - in: query
 *         name: filter
 *         schema: { type: string, enum: [favorites, archived] }
 *         description: Show only favorite or archived certificates.
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 12 }
 *     responses:
 *       '200':
 *         description: A paginated list of the student's certificates.
 *       '401':
 *         description: Unauthorized.
 */
router.get(
  '/',
  requireAuth,
  validateRequest(getCertificatesQuerySchema),
  CertificateController.getMyCertificates
);

export { router as certificateRouter };
