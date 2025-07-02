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