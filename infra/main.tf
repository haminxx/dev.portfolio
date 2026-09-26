terraform {
  required_version = ">= 1.8"

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 6.0"
    }
  }

  backend "gcs" {
    bucket = "tomo-computer-tfstate"
    prefix = "tofu"
  }
}

variable "project" {
  default = "tomo-computer"
}

variable "region" {
  default = "us-west1"
}

variable "zone" {
  default = "us-west1-b"
}

variable "machine_type" {
  default = "e2-standard-4"
}

variable "data_disk_gb" {
  default = 100
}

provider "google" {
  project = var.project
  region  = var.region
  zone    = var.zone
}

resource "google_project_service" "apis" {
  for_each = toset([
    "compute.googleapis.com",
    "iap.googleapis.com",
    "artifactregistry.googleapis.com",
  ])
  service            = each.value
  disable_on_destroy = false
}

resource "google_artifact_registry_repository" "tomo" {
  repository_id = "tomo"
  format        = "DOCKER"
  location      = var.region
  depends_on    = [google_project_service.apis]
}

resource "google_service_account" "vm" {
  account_id = "tomo-vm"
}

resource "google_project_iam_member" "vm" {
  for_each = toset([
    "roles/artifactregistry.reader",
    "roles/logging.logWriter",
    "roles/monitoring.metricWriter",
  ])
  project = var.project
  role    = each.value
  member  = "serviceAccount:${google_service_account.vm.email}"
}

resource "google_compute_address" "tomo" {
  name       = "tomo"
  depends_on = [google_project_service.apis]
}

resource "google_compute_disk" "data" {
  name       = "tomo-data"
  type       = "pd-balanced"
  size       = var.data_disk_gb
  depends_on = [google_project_service.apis]

  lifecycle {
    prevent_destroy = true
  }
}

resource "google_compute_instance" "tomo" {
  name         = "tomo"
  machine_type = var.machine_type
  tags         = ["tomo"]

  boot_disk {
    initialize_params {
      image = "ubuntu-os-cloud/ubuntu-2404-lts-amd64"
      size  = 30
      type  = "pd-balanced"
    }
  }

  attached_disk {
    source      = google_compute_disk.data.id
    device_name = "data"
  }

  network_interface {
    network = "default"
    access_config {
      nat_ip = google_compute_address.tomo.address
    }
  }

  service_account {
    email  = google_service_account.vm.email
    scopes = ["cloud-platform"]
  }

  metadata = {
    enable-oslogin = "TRUE"
    user-data      = templatefile("${path.module}/cloud-init.yaml", { region = var.region })
  }

  depends_on = [google_project_service.apis]
}

resource "google_compute_firewall" "web" {
  name    = "tomo-web"
  network = "default"

  allow {
    protocol = "tcp"
    ports    = ["80", "443"]
  }

  allow {
    protocol = "udp"
    ports    = ["443"]
  }

  source_ranges = ["0.0.0.0/0"]
  target_tags   = ["tomo"]
  depends_on    = [google_project_service.apis]
}

resource "google_compute_firewall" "iap_ssh" {
  name    = "tomo-iap-ssh"
  network = "default"

  allow {
    protocol = "tcp"
    ports    = ["22"]
  }

  source_ranges = ["35.235.240.0/20"]
  target_tags   = ["tomo"]
  depends_on    = [google_project_service.apis]
}

output "ip" {
  value = google_compute_address.tomo.address
}

output "image" {
  value = "${var.region}-docker.pkg.dev/${var.project}/${google_artifact_registry_repository.tomo.repository_id}/api"
}
