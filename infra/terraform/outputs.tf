output "aws_region" {
  description = "AWS region"
  value       = var.aws_region
}


output "ecr_repository_urls" {
  description = "A map of service names to their ECR repository URLs."
  value = {
    auth_service         = module.ecr_auth_service.repository_url
    user_service         = module.ecr_user_service.repository_url
    media_service        = module.ecr_media_service.repository_url
    notification_service = module.ecr_notification_service.repository_url
    course_service       = module.ecr_course_service.repository_url
    enrollment_service   = module.ecr_enrollment_service.repository_url
  }
}


output "cluster_endpoint" {
  description = "The endpoint for the EKS cluster's Kubernetes API."
  value       = module.eks.cluster_endpoint
}

output "cluster_name" {
  description = "The name of the EKS cluster."
  value       = module.eks.cluster_name
}

output "cluster_arn" {
  description = "The ARN of the EKS cluster,"
  value       = module.eks.cluster_arn
}

output "cluster_oidc_issuer_url" {
  description = "The OIDC issuer URL for the EKS cluster,"
  value       = module.eks.cluster_oidc_issuer_url
}


output "vpc_id" {
  description = "The ID of the VPC."
  value       = module.vpc.vpc_id
}

output "public_subnet_ids" {
  description = "List of IDs of the public subnets."
  value       = module.vpc.public_subnet_ids
}

output "private_subnet_ids" {
  description = "List of IDs of the private subnets."
  value       = module.vpc.private_subnet_ids
}


output "s3_raw_uploads_bucket_name" {
  description = "The name of the S3 bucket for raw media uploads."
  value       = aws_s3_bucket.raw_uploads.bucket
}

output "s3_processed_media_bucket_name" {
  description = "The name of the S3 bucket for processed media."
  value       = aws_s3_bucket.processed_media.bucket
}

output "sqs_s3_events_queue_url" {
  description = "The URL of the SQS queue for S3 events."
  value       = aws_sqs_queue.s3_events_queue.id
}
