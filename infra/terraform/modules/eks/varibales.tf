variable "project_name" {
  description = "The name of the project"
  type        = string
}

variable "vpc_id" {
  description = "The ID of the VPC where the cluster will be deployed"
  type        = string
}

variable "private_subnet_ids" {
  description = "A list of private subnet IDs for the EKS worker nodes."
  type        = list(string)
}