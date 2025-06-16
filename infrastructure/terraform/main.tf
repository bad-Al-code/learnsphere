terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
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

module "eks" {
  source = "./modules/eks"

 project_name = var.project_name 
 vpc_id = module.vpc.vpc_id 
 private_subnet_ids = module.vpc.private_subnets
}