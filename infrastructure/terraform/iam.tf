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
