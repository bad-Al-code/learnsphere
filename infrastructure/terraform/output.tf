output "raw_uploads_bucket_name" {
  value = aws_s3_bucket.raw_uploads.bucket
}

output "processed_media_bucket_name" {
  value = aws_s3_bucket.processed_media.bucket
}

output "sqs_queue_url" {
  value = aws_sqs_queue.s3_events_queue.id
}

output "media_service_access_key_id" {
  value     = aws_iam_access_key.media_service_keys.id
  sensitive = true
}

output "media_service_secret_access_key" {
  value     = aws_iam_access_key.media_service_keys.secret
  sensitive = true
}

output "ecr_repo_urls" {
  description = "A map of service names to their ECR repository URLs"
  value = {
    auth_service         = module.ecr_auth_service.repository_url
    user_service         = module.ecr_user_service.repository_url
    media_service        = module.ecr_media_service.repository_url
    notification_service = module.ecr_notification_service.repository_url
    course_service       = module.ecr_course_service.repository_url
  }
}