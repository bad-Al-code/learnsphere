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
