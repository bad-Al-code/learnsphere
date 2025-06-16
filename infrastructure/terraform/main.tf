terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "6.0.0-beta3"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

module "vpc" {
  source     = "./modules/vpc"
  aws_region = var.aws_region
}

module "ecr_auth_service" {
  source          = "./modules/ecr"
  repository_name = "learnsphere/auth-service"
}

module "ecr_user_service" {
  source          = "./modules/ecr"
  repository_name = "learnsphere/user-service"
}

module "ecr_media_service" {
  source          = "./modules/ecr"
  repository_name = "learnsphere/media-service"
}

module "ecr_notification_service" {
  source          = "./modules/ecr"
  repository_name = "learnsphere/notification-service"
}

module "ecr_course_service" {
  source          = "./modules/ecr"
  repository_name = "learnsphere/course-service"
}