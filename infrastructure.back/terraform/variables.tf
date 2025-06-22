variable "aws_region" {
  description = "The AWS region to deploy resource in"
  type        = string
  default     = "ap-south-1"
}

variable "project_name" {
  description = "The name of the project, used for tagging resources."
  type        = string
  default     = "learnsphere"
}

variable "raw_bucket_name" {
  description = "The unique name for the raw media uploads S3 bucket"
  type        = string
  default     = "learnsphere-raw-uploads-acomjehk"
}

variable "processed_bucket_name" {
  description = "The unique name for the processed media  S3 bucket"
  type        = string
  default     = "learnsphere-processed-media-xt9tcab6"
}

variable "sqs_queue_name" {
  description = "The name of the SQS queue for S3 events."
  type        = string
  default     = "s3-media-events-queue"
}

variable "github_actions_cidrs" {
  description = "A list of CIDR blocks for GitHub Actions runners to allow access to the EKS public endpoint."
  type        = list(string)
  default     = [] 
}