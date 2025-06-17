terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}



locals {
  github_actions_ipv4_cidrs = slice([
    for cidr in var.github_actions_cidrs : cidr if !strcontains(cidr, ":")
  ], 0, 39)
}
data "http" "my_ip" {
  url = "http://ipv4.icanhazip.com"
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

  project_name       = var.project_name
  vpc_id             = module.vpc.vpc_id
  private_subnet_ids = module.vpc.private_subnets
  cluster_version    = "1.32"
 cluster_endpoint_public_access_cidrs = concat(
    local.github_actions_ipv4_cidrs,
    ["${chomp(data.http.my_ip.response_body)}/32"] 
  )
}