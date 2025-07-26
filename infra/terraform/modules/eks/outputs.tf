output "cluster_endpoint" {
  description = "The endpoint for the EKS cluster's Kubernetes API."
  value       = module.eks.cluster_endpoint
}

output "cluster_name" {
  description = "The name of the EKS cluster."
  value       = module.eks.cluster_name
}

output "cluster_arn" {
  description = "The ARN of the EKS cluster,"
  value       = module.eks.cluster_arn
}

output "cluster_oidc_issuer_url" {
  description = "The OIDC issuer URL for the EKS cluster,"
  value       = module.eks.cluster_oidc_issuer_url
}

output "oidc_provider_arn" {
  description = "The ARN of the OIDC Provider."
  value       = module.eks.oidc_provider_arn
}
