resource "aws_iam_user" "media_service_user" {
  name = "media-service-user"
}

resource "aws_iam_access_key" "media_service_keys" {
  user = aws_iam_user.media_service_user.name
}

resource "aws_iam_policy" "media_service_policy" {
  name        = "MediaServicePolicy"
  description = "Permissions for the LearnSphere media service"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:PutObject",
          "s3:GetObject",
          "s3:GetObjectTagging",
          "s3:PutObjectTagging"
        ]
        Resource = [
          "${aws_s3_bucket.raw_uploads.arn}/*",
          "${aws_s3_bucket.processed_media.arn}/*"
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "sqs:ReceiveMessage",
          "sqs:DeleteMessage",
          "sqs:GetQueueAttributes"
        ]
        Resource = aws_sqs_queue.s3_events_queue.arn
      }
    ]
  })
}

resource "aws_iam_user_policy_attachment" "media_service_attach" {
  user       = aws_iam_user.media_service_user.name
  policy_arn = aws_iam_policy.media_service_policy.arn
}


# resource "aws_iam_user" "cicd_user" {
#   name = "learnsphere-cicd-user"
# }

# resource "aws_iam_access_key" "cicd_user_keys" {
#   user = aws_iam_user.cicd_user.name
# }

# resource "aws_iam_policy" "cicd_policy" {
#   name        = "LearnSphereCICDPolicy"
#   description = "Permissions for the LearnSphere GitHub Actions CI/CD pipeline"

#   policy = jsonencode({
#     Version = "2012-10-17"
#     Statement = [
#       {
#         # Permissions needed for the 'aws-actions/login-ecr' action
#         Effect = "Allow"
#         Action = [
#           "ecr:GetAuthorizationToken"
#         ]
#         Resource = "*" # This action requires a wildcard resource
#       },
#       {
#         # Permissions needed to push images to our ECR repositories
#         Effect = "Allow"
#         Action = [
#           "ecr:CompleteLayerUpload",
#           "ecr:UploadLayerPart",
#           "ecr:InitiateLayerUpload",
#           "ecr:BatchCheckLayerAvailability",
#           "ecr:PutImage"
#         ]
#         # Restrict to only the repositories we created
#         Resource = [
#           module.ecr_auth_service.repository_arn,
#           module.ecr_user_service.repository_arn,
#           module.ecr_media_service.repository_arn,
#           module.ecr_notification_service.repository_arn,
#           module.ecr_course_service.repository_arn
#         ]
#       },
#       {
#         # Permissions needed for the 'aws eks update-kubeconfig' command
#         Effect   = "Allow"
#         Action   = "eks:DescribeCluster"
#         Resource = module.eks.cluster_arn
#       }
#     ]
#   })
# }

# resource "aws_iam_user_policy_attachment" "cicd_attach" {
#   user       = aws_iam_user.cicd_user.name
#   policy_arn = aws_iam_policy.cicd_policy.arn
# }