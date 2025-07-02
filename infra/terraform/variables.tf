variable "aws_region" {
  description = "The AWS region"
  type = string 
  default = "ap-south-1"
}

variable "project_name" {
  description = "The name of the project, used for tagging and naming resources."
  type = string
  default = "learnsphere"
}