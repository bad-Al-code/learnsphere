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
  source             = "./modules/eks"
  project_name       = var.project_name
  vpc_id             = module.vpc.vpc_id
  private_subnet_ids = module.vpc.private_subnet_ids
  cicd_user_arn      = aws_iam_user.cicd_user.arn
  # ebs_csi_driver_role_arn = module.ebs_csi_irsa_role.iam_role_arn
}

# =================================================================
# === IAM Role for EBS CSI Driver (using IAM Roles for Service Accounts)
# =================================================================
module "ebs_csi_irsa_role" {
  source  = "terraform-aws-modules/iam/aws//modules/iam-role-for-service-accounts-eks"
  version = "5.39.0"

  role_name             = "${var.project_name}-ebs-csi-controller-role"
  attach_ebs_csi_policy = true

  # This is the key: We now reference the output of the EKS module directly.
  oidc_providers = {
    main = {
      provider_arn               = module.eks.oidc_provider_arn # Use the direct output
      namespace_service_accounts = ["kube-system:ebs-csi-controller-sa"]
    }
  }

  tags = {
    Project = var.project_name
  }
}

# =================================================================
# === EKS Add-on for EBS CSI Driver
# =================================================================
# We create the add-on as a SEPARATE resource, AFTER the cluster and role exist.
resource "aws_eks_addon" "ebs_csi" {
  cluster_name             = module.eks.cluster_name
  addon_name               = "aws-ebs-csi-driver"
  service_account_role_arn = module.ebs_csi_irsa_role.iam_role_arn

  # This ensures Terraform creates the addon only after the role is fully created.
  depends_on = [module.ebs_csi_irsa_role]
}
