# ============================================
# ===       IAM User for Media Service     ===
# ============================================
resource "aws_iam_user" "media_service_user" {
  name = "${var.project_name}-media-service-user"
}

resource "aws_iam_access_key" "media_service_user_key" {
  user = aws_iam_user.media_service_user.name
}

resource "aws_iam_policy" "media_service_policy" {
  name        = "${var.project_name}-MediaServicePolicy"
  description = "Permissions for the LearnSphere media-service application"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "s3:PutObject",
          "s3:GetObject",
          "s3:GetObjectTagging"
        ],
        Resource = [
          "${aws_s3_bucket.raw_uploads.arn}/*",
          "${aws_s3_bucket.processed_media.arn}/*"
        ]
      },
      {
        Effect = "Allow",
        Action = [
          "sqs:ReceiveMessage",
          "sqs:DeleteMessage",
          "sqs:GetQueueAttributes"
        ],
        Resource = aws_sqs_queue.s3_events_queue.arn
      }
    ]
  })
}

resource "aws_iam_user_policy_attachment" "media_service_attach" {
  user       = aws_iam_user.media_service_user.name
  policy_arn = aws_iam_policy.media_service_policy.arn
}

# ============================================
# ===     IAM User for CI/CD Pipeline      ===
# ============================================
resource "aws_iam_user" "cicd_user" {
  name = "${var.project_name}-cicd-user"
}

resource "aws_iam_access_key" "cicd_user_key" {
  user = aws_iam_user.cicd_user.name
}

resource "aws_iam_policy" "cicd_policy" {
  name        = "${var.project_name}-CICDPolicy"
  description = "Permissions for the LearnSphere GitHub Actions CI/CD pipeline"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect   = "Allow",
        Action   = "ecr:GetAuthorizationToken",
        Resource = "*"
      },
      {
        Effect = "Allow",
        Action = [
          "ecr:CompleteLayerUpload",
          "ecr:UploadLayerPart",
          "ecr:InitiateLayerUpload",
          "ecr:BatchCheckLayerAvailability",
          "ecr:PutImage"
        ],
        Resource = [
          module.ecr_auth_service.repository_arn,
          module.ecr_user_service.repository_arn,
          module.ecr_media_service.repository_arn,
          module.ecr_notification_service.repository_arn,
          module.ecr_course_service.repository_arn,
          module.ecr_enrollment_service.repository_arn
        ]
      },
      {
        Effect   = "Allow",
        Action   = "eks:DescribeCluster",
        Resource = module.eks.cluster_arn
      }
    ]
  })
}

resource "aws_iam_user_policy_attachment" "cicd_attach" {
  user       = aws_iam_user.cicd_user.name
  policy_arn = aws_iam_policy.cicd_policy.arn
}

