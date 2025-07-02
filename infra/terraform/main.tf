terraform {
  required_providers {
    aws = {
      source = "hashicorp/aws"
      version = "6.0.0"
    }
  }
}

provider "aws" {
region = var.aws_region
}

module "vpc" {
  source = "./modules/vpc"

  aws_region = var.aws_region
  project_name = var.project_name
}