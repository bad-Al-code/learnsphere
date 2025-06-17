variable "project_name" {
  description = "The name of the project"
  type        = string
}

variable "vpc_id" {
  description = "The ID of the VPC where the cluster will be deployed."
  type        = string
}

variable "private_subnet_ids" {
  description = "A list of private subnet IDs for the EKS worker nodes."
  type        = list(string)
}

variable "cluster_version" {
  description = "The Kubernetes version for EKS cluster."
  type        = string
  default     = "1.32"
}

variable "cluster_endpoint_public_access_cidrs" {
  description = "List of CIDR blocks that can access the EKS public endpoint"
  type        = list(string)
  default     = []
}