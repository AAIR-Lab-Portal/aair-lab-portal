---
title: "GPU Cluster Environment Setup & SSH Guide"
date: "2026-08-30"
author: "Ngo Minh Chau"
type: "Tutorial"
excerpt: "A complete walkthrough for initializing secure shell connections and activating conda environments on the NVIDIA A100 cluster."
---

## Overview

Accessing the AAIR Lab GPU cluster requires a strict sequence of VPN authentications and SSH handshakes. This tutorial outlines the standard operating procedure for all new researchers.

## Prerequisites

1. **Cisco AnyConnect:** You must be connected to the university VPN (`vpn.vgu.edu.vn`).
2. **Authorized Key:** Your RSA public key must be added to the cluster's authorized hosts.

## Connection Protocol

Execute the following command in your local terminal. Replace the bracketed text with your assigned university ID.

```bash
ssh [your_id]@cluster.aair.vgu.edu.vn -p 2202
```
Once connected, verify the active GPU instances before executing any training scripts:

```bash
nvidia-smi
```

