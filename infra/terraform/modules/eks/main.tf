module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "20.10.0"


  cluster_name    = "${var.project_name}-cluster"
  cluster_version = "1.31"

  vpc_id     = var.vpc_id
  subnet_ids = var.private_subnet_ids

  cluster_endpoint_public_access           = true
  enable_cluster_creator_admin_permissions = true

  access_entries = {
    cicd_user_admin = {
      principal_arn = var.cicd_user_arn

      policy_associations = {
        cluster_admin = {
          policy_arn = "arn:aws:eks::aws:cluster-access-policy/AmazonEKSClusterAdminPolicy"
          access_scope = {
            type = "cluster"
          }
        }
      }
    }
  }

  cluster_addons = {
    aws-ebs-csi-driver = {
      most_recent = true
    }
  }

  eks_managed_node_groups = {
    learnsphere_nodes = {
      name           = "${var.project_name}-node-group"
      min_size       = 2
      max_size       = 4
      desired_size   = 2
      instance_types = ["t3.medium"]
    }
  }


  tags = {
    Environment = "development"
    Terraform   = "true"
    Project     = var.project_name
  }
}
