locals {
  random_suffix         = random_string.bucket_suffix.result
  raw_bucket_name       = "${var.project_name}-raw-uploads-${local.random_suffix}"
  processed_bucket_name = "${var.project_name}-processed-media-${local.random_suffix}"
}

resource "random_string" "bucket_suffix" {
  length  = 8
  special = false
  upper   = false
}

# ============================================
# ===     Raw Uploads S3 Bucket (Private)  ===
# ============================================
resource "aws_s3_bucket" "raw_uploads" {
  bucket = local.raw_bucket_name
}

resource "aws_s3_bucket_cors_configuration" "raw_uploads_cors" {
  bucket = aws_s3_bucket.raw_uploads.bucket

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["PUT", "POST"]
    allowed_origins = ["*"]
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }
}

resource "aws_s3_bucket_public_access_block" "raw_uploads_access_block" {
  bucket = aws_s3_bucket.raw_uploads.bucket

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# ============================================
# ===   Processed Media S3 Bucket (Public) ===
# ============================================
resource "aws_s3_bucket" "processed_media" {
  bucket = local.processed_bucket_name
}

resource "aws_s3_bucket_public_access_block" "processed_media_access_block" {
  bucket = aws_s3_bucket.processed_media.bucket

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_policy" "processed_media_policy" {
  bucket = aws_s3_bucket.processed_media.bucket
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.processed_media.arn}/*"
      },
    ]
  })

  depends_on = [aws_s3_bucket_public_access_block.processed_media_access_block]
}


# ============================================
# ===       SQS Queue for S3 Events        ===
# ============================================
resource "aws_sqs_queue" "s3_events_dlq" {
  name = "${var.project_name}-s3-events-dlq"
}

resource "aws_sqs_queue" "s3_events_queue" {
  name = "${var.project_name}-s3-events-queue"

  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.s3_events_dlq.arn
    maxReceiveCount     = 3
  })
}

resource "aws_sqs_queue_policy" "s3_events_queue_policy" {
  queue_url = aws_sqs_queue.s3_events_queue.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect    = "Allow"
        Principal = { Service = "s3.amazonaws.com" }
        Action    = "sqs:SendMessage"
        Resource  = aws_sqs_queue.s3_events_queue.arn
        Condition = {
          ArnEquals = { "aws:SourceArn" = aws_s3_bucket.raw_uploads.arn }
        }
      }
    ]
  })
}

resource "aws_s3_bucket_notification" "bucket_notification" {
  bucket = aws_s3_bucket.raw_uploads.bucket

  queue {
    queue_arn     = aws_sqs_queue.s3_events_queue.arn
    events        = ["s3:ObjectCreated:*"]
    filter_prefix = "uploads/"
  }

  depends_on = [aws_sqs_queue_policy.s3_events_queue_policy]
}
