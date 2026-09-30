#!/usr/bin/env bash
# Original tomo-computer target. Override in the environment before apply or ssh.
: "${GCP_PROJECT:=tomo-computer}"
: "${GCP_ZONE:=us-west1-b}"
: "${VM_NAME:=tomo}"
: "${DOMAIN:=tomo.computer}"
export GCP_PROJECT GCP_ZONE VM_NAME DOMAIN
