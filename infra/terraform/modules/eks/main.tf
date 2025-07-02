module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "~> 20.31"

  cluster_name    = "${var.project_name}-cluster"
  cluster_version = "1.31"

  vpc_id     = var.vpc_id
  subnet_ids = var.private_subnet_ids

  cluster_endpoint_public_access = true

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