import { Router } from 'express';

import { CertificateController } from '../controllers';
import { requireAuth, validateRequest } from '../middlewares';
import {
  bulkActionSchema,
  certificateParamsSchema,
  getCertificatesQuerySchema,
  updateNotesSchema,
} from '../schema';
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

/**
 * @openapi
 * /api/enrollments/my-certificates/{enrollmentId}/toggle-favorite:
 *   patch:
 *     summary: "[Student] Toggle the favorite status of a certificate"
 *     tags: [Certificates]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: enrollmentId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       '200':
 *         description: Favorite status toggled successfully. Returns the updated certificate/enrollment object.
 *       '401':
 *         description: Unauthorized.
 *       '403':
 *         description: Forbidden. User does not own this certificate.
 *       '404':
 *         description: Certificate not found.
 */
router.patch(
  '/:enrollmentId/toggle-favorite',
  requireAuth,
  validateRequest(certificateParamsSchema),
  CertificateController.toggleFavorite
);

/**
 * @openapi
 * /api/enrollments/my-certificates/{enrollmentId}/toggle-archive:
 *   patch:
 *     summary: "[Student] Toggle the archive status of a certificate"
 *     tags: [Certificates]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: enrollmentId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       '200':
 *         description: Archive status toggled successfully.
 *       '401':
 *         description: Unauthorized.
 *       '403':
 *         description: Forbidden. User does not own this certificate.
 *       '404':
 *         description: Certificate not found.
 */
router.patch(
  '/:enrollmentId/toggle-archive',
  requireAuth,
  validateRequest(certificateParamsSchema),
  CertificateController.toggleArchive
);

/**
 * @openapi
 * /api/enrollments/my-certificates/{enrollmentId}/notes:
 *   put:
 *     summary: "[Student] Update notes for a certificate"
 *     tags: [Certificates]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: enrollmentId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               notes:
 *                 type: string
 *                 description: The text content of the notes.
 *     responses:
 *       '200':
 *         description: Notes updated successfully.
 *       '400':
 *         description: Invalid input for notes.
 *       '401':
 *         description: Unauthorized.
 *       '403':
 *         description: Forbidden.
 *       '404':
 *         description: Certificate not found.
 */
router.put(
  '/:enrollmentId/notes',
  requireAuth,
  validateRequest(certificateParamsSchema.merge(updateNotesSchema)),
  CertificateController.updateNotes
);

/**
 * @openapi
 * /api/enrollments/my-certificates/{enrollmentId}:
 *   delete:
 *     summary: "[Student] Delete a certificate"
 *     tags: [Certificates]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: enrollmentId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       '204':
 *         description: Certificate deleted successfully.
 *       '401':
 *         description: Unauthorized.
 *       '403':
 *         description: Forbidden.
 *       '404':
 *         description: Certificate not found.
 */
router.delete(
  '/:enrollmentId',
  requireAuth,
  validateRequest(certificateParamsSchema),
  CertificateController.deleteCertificate
);

/**
 * @openapi
 * /api/enrollments/my-certificates/bulk-archive:
 *   post:
 *     summary: "[Student] Archive multiple certificates at once"
 *     tags: [Certificates]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               enrollmentIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uuid
 *     responses:
 *       '200':
 *         description: Certificates archived successfully.
 */
router.post(
  '/bulk-archive',
  requireAuth,
  validateRequest(bulkActionSchema),
  CertificateController.bulkArchive
);

/**
 * @openapi
 * /api/enrollments/my-certificates/bulk-delete:
 *   post:
 *     summary: "[Student] Delete multiple certificates at once"
 *     tags: [Certificates]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               enrollmentIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uuid
 *     responses:
 *       '204':
 *         description: Certificates deleted successfully.
 */
router.post(
  '/bulk-delete',
  requireAuth,
  validateRequest(bulkActionSchema),
  CertificateController.bulkDelete
);

export { router as certificateRouter };
