module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "20.37.0"


  cluster_name    = "${var.project_name}-eks-cluster"
  cluster_version = var.cluster_version

  vpc_id     = var.vpc_id
  subnet_ids = var.private_subnet_ids

  eks_managed_node_groups = {
    learnsphere_nodes = {
      min_size = 1
      max_size = 3
      desired_size = 2
    
    instance_type = ["t3.medium"]
    capacity_type = "ON_DEMAND"
    }
  }
  tags = {
    Environment = "dev"
    Terraform   = "true"
    Project = var.project_name
  }
}