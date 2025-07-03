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

variable "cicd_user_arn" {
  description = "The ARN of the IAM user for the CI/CD pipeline."
  type        = string
}

variable "ebs_csi_driver_role_arn" {
  description = "The ARN of the IAM role for the EBS CSI Driver service account."
  type        = string
  default     = ""
}
