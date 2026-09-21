---
title: "Legacy Distributed Sensor Network"
date: "2024-08-15"
lead: "Le Lam Son, 102, [Pham Quoc Bao](https://arxiv.org)"
status: "Completed"
tech: "Arduino, C++, MQTT"
canvas_tags: ["ML Foundation"]
excerpt: "The first iteration of our environmental telemetry network. Successfully concluded and superseded by the ESP32 framework."
---

## Post-Mortem Analysis
This project served as the foundational architecture for the lab's hardware telemetry initiatives. It relied heavily on standard Arduino frameworks and wired MQTT bridges.

## Key Learnings
While successful in stable environments, the network suffered from severe packet loss when transitioning to wireless payloads. The C++ memory allocation routines frequently triggered buffer overflows when handling high-frequency sensor interrupts.

## Deprecation Notice
This repository is marked as **Completed** and is no longer actively maintained. All operational nodes have been migrated to the newer `EmotionDiary` framework utilizing ESP32 microcontrollers.