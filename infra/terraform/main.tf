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
  source = "./modules/vpc"

  aws_region   = var.aws_region
  project_name = var.project_name
}

# ============================================
# ===       ECR Repositories             ===
# ============================================
module "ecr_auth_service" {
  source          = "./modules/ecr"
  project_name    = var.project_name
  repository_name = "${var.project_name}/auth-service"
}

module "ecr_user_service" {
  source          = "./modules/ecr"
  project_name    = var.project_name
  repository_name = "${var.project_name}/user-service"
}

module "ecr_media_service" {
  source          = "./modules/ecr"
  project_name    = var.project_name
  repository_name = "${var.project_name}/media-service"
}

module "ecr_notification_service" {
  source          = "./modules/ecr"
  project_name    = var.project_name
  repository_name = "${var.project_name}/notification-service"
}

module "ecr_course_service" {
  source          = "./modules/ecr"
  project_name    = var.project_name
  repository_name = "${var.project_name}/course-service"
}

module "ecr_enrollment_service" {
  source          = "./modules/ecr"
  project_name    = var.project_name
  repository_name = "${var.project_name}/enrollment-service"
}

# ============================================
# ===       ECS Cluster                    ===
# ============================================
module "eks" {
  source                  = "./modules/eks"
  project_name            = var.project_name
  vpc_id                  = module.vpc.vpc_id
  private_subnet_ids      = module.vpc.private_subnet_ids
  cicd_user_arn           = aws_iam_user.cicd_user.arn
  ebs_csi_driver_role_arn = module.ebs_csi_irsa_role.iam_role_arn
}
