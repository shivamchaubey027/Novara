variable "monitoring_namespace" {
  description = "The namespace for monitoring components."
  type        = string
  default     = "monitoring"
}
variable "rbac" {
  description = "This is to name service account, clusterRole and clusterRoleBinding"
  type = string
  default = "prometheus"
}