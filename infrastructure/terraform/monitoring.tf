resource "kubernetes_namespace" "monitoring" {
  metadata {
    name = var.monitoring_namespace
  }
}

resource "kubernetes_service_account" "prometheus" {
  metadata {
    name      = var.rbac
    namespace = var.monitoring_namespace
  }
  depends_on = [
    kubernetes_namespace.monitoring
  ]
}

resource "kubernetes_cluster_role" "prometheus" {
  metadata {
    name = var.rbac
  }
  rule {
    api_groups = [""]
    resources  = ["nodes", "nodes/proxy", "services", "endpoints", "pods"]
    verbs      = ["get", "list", "watch"]
  }
}

resource "kubernetes_cluster_role_binding" "prometheus" {
  metadata {
    name = var.rbac
  }
  depends_on = [
    kubernetes_namespace.monitoring
  ]
  role_ref {
    api_group = "rbac.authorization.k8s.io"
    kind      = "ClusterRole"
    name      = kubernetes_cluster_role.prometheus.metadata[0].name
  }
  subject {
    kind      = "ServiceAccount"
    name      = kubernetes_service_account.prometheus.metadata[0].name
    namespace = kubernetes_namespace.monitoring.metadata[0].name
  }
}


resource "kubernetes_config_map" "prometheus_config" {
  metadata {
    name      = "prometheus-server-conf"
    namespace = kubernetes_namespace.monitoring.metadata[0].name
  }
  depends_on = [
    kubernetes_namespace.monitoring
  ]
  data = {
    "prometheus.yml" = <<-EOT
      global:
        scrape_interval: 15s
      scrape_configs:
      - job_name: 'prometheus'
        static_configs:
          - targets: ['localhost:9090']
    
      - job_name: 'node-exporter'
        kubernetes_sd_configs:
          - role: endpoints
            namespaces:
              names:
                - monitoring
        relabel_configs:
          - source_labels: [__meta_kubernetes_service_label_app] 
            regex: node-exporter
            action: keep
      - job_name: 'kube-state-metrics'
        static_configs:
          - targets: ['ksm-service:8080']
      - job_name: 'watcherBot'
        static_configs:
          - targets: ['watcherBot-svc:8080']
    EOT
  }
}

# PVC removed - will use emptyDir for now
# You can add persistent storage later once everything works

resource "kubernetes_deployment" "prometheus_server" {
  metadata {
    name      = "prometheus-server"
    namespace = kubernetes_namespace.monitoring.metadata[0].name
  }
  depends_on = [
    kubernetes_namespace.monitoring,
    kubernetes_service_account.prometheus,
    kubernetes_cluster_role_binding.prometheus,
    kubernetes_config_map.prometheus_config
  ]
  
  spec {
    replicas = 1
    selector {
      match_labels = {
        app = "prometheus-server"
      }
    }
    template {
      metadata {
        labels = {
          app = "prometheus-server"
        }
      }
      spec {
        service_account_name = kubernetes_service_account.prometheus.metadata[0].name
        container {
          name  = "prometheus"
          image = "prom/prometheus"

          args = [
            "--config.file=/etc/prometheus/prometheus.yml",
            "--storage.tsdb.path=/prometheus"
          ]
          
          resources {
            requests = {
              memory = "256Mi"
              cpu    = "250m"
            }
            limits = {
              memory = "512Mi"
              cpu    = "500m"
            }
          }

          port {
            container_port = 9090
          }

          volume_mount {
            name       = "config-volume"
            mount_path = "/etc/prometheus"
          }

          volume_mount {
            name       = "storage-volume"
            mount_path = "/prometheus"
          }
        }
        volume {
          name = "config-volume"
          config_map {
            name = kubernetes_config_map.prometheus_config.metadata[0].name
          }
        }
        volume {
          name = "storage-volume"
          persistent_volume_claim {
            claim_name = "prometheus-pvc-new"
          }

        }
      }
    }
  }
}
resource "kubernetes_persistent_volume_claim" "prometheus-pvc" {
  metadata {
    name      = "prometheus-pvc-new"
    namespace = kubernetes_namespace.monitoring.metadata[0].name
  }
  depends_on = [kubernetes_namespace.monitoring]

  spec {
    access_modes       = ["ReadWriteOnce"]
    storage_class_name = "microk8s-hostpath"
    resources {
      requests = {
        storage = "2Gi"
      }
    }
  }
}
resource "kubernetes_service" "prometheus_service" {
  metadata {
    name      = "prometheus-service"
    namespace = kubernetes_namespace.monitoring.metadata[0].name
    labels = {
      app = "prometheus-server"
    }
  }
  depends_on = [kubernetes_deployment.prometheus_server]

  spec {
    selector = {
      app = "prometheus-server"
    }

    port {
      port        = 80
      target_port = 9090
    }
    type = "ClusterIP"
  }
}

# resource "d" "node_exporter" {
#   metadata {
#     name = "node-exporter"
#     namespace = kubernetes_namespace.monitoring.metadata[0].name
#   }
  
#     template {
#     spec {
#     replicas = 1
#     match_labels{
#       name= "node-exporter"
#     }
#       container{
#         name="node-exporter"
#       }
#     }
  
# }

resource "kubernetes_daemonset" "node_exporter" {
  metadata {
    name = "node-exporter"
    namespace = kubernetes_namespace.monitoring.metadata[0].name
    labels ={
      app="node-exporter"
    }
  }
  spec{
    selector{
      match_labels={
        app="node-exporter"
      }
    }
    template{
      metadata{
        labels={
          app= "node-exporter"
        }
      }
      spec{
        container{
          name="node-exporter"
          image="prom/node-exporter:latest"
          args=[
            "--path.procfs=/host/proc",
            "--path.sysfs=/host/sys",
          ]
          port{
            container_port=9100
          }
          volume_mount{
            name="proc"
            mount_path="/host/proc"
          }
          volume_mount{
            name="sys"
            mount_path="/host/sys"
          }
        }
        volume{
          name= "proc"
          host_path{
            path="/proc"
          }
        }
        volume{
          name="sys"
          host_path{
            path="/sys"
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "node_exporter_svc" {
  metadata {
    name="node-exporter-svc"
    namespace = kubernetes_namespace.monitoring.metadata[0].name
    labels = {
      app= "node-exporter"
    }
    # depends_on = [kubernetes_daemon_set.node_exporter]

  }
  spec {
    selector = {
      app= "node-exporter"
    }
    port {
      port = 9100
      target_port = 9100
    }
    type = "ClusterIP"
  }
}


resource "kubernetes_deployment" "grafana" {
  metadata {
    name="grafana"
    namespace = kubernetes_namespace.monitoring.metadata[0].name
  }
  spec {
    replicas = 1
    selector {
      match_labels = {
        app= "grafana"
      }
    }
    template {
      metadata {
        labels = {
          app="grafana"
        }
      }
      spec {
        container {
          name="grafana"
          image = "grafana/grafana:latest"
          port {
            container_port = 3000
          }
          resources {
            requests = {
              memory= "256Mi"
              cpu="250m"
            }
            limits = {
              memory="512Mi"
              cpu="500m"
            }
          }
        
        }
        }
        
    
      }
    }
  }


resource "kubernetes_service" "grafana-svc" {
  metadata {
    name = "grafana-svc"
    namespace = kubernetes_namespace.monitoring.metadata[0].name
  }
  spec {
    selector = {
      app= "grafana"
    }
    port {
      port = 80
      target_port = 3000
    }
    type = "ClusterIP"
  }
}