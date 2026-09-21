---
title: "EmotionDiary: Edge Computing Telemetry"
lead: "Ngo Minh Chau"
date: "2026-04-12"
status: "Published"
tech: "Next.js, Python, ESP32"
canvas_tags: ["Imbalanced Learning", "ML Foundation"]
excerpt: "A decentralized edge architecture capturing psychological telemetry via microcontroller arrays, published at IEEE Edge 2026."
image: "/images/projects/emotion-diary.png"
image_caption: "Early prototype of the ESP32 array connected to the biometric cushion."
publication_slug: "emotiondiary-embedded-telemetry"
---

## System Overview
**EmotionDiary** is a decentralized AIoT platform designed to capture and analyze real-time human emotional telemetry using embedded edge devices. 

Instead of routing raw sensor data to a centralized cloud, which introduces latency and privacy concerns, this project utilizes **Edge-based Convolutional Neural Networks (CNNs)** to process posture and movement data directly on the device.

## Architecture Highlights
1. **Sensor Node:** An ESP32 microcontroller embedded in a seat cushion.
2. **Data Pipeline:** Telemetry is transmitted via the lightweight MQTT protocol.
3. **Inference Engine:** The model executes locally, returning only the categorized emotional state.

![ESP32 Hardware Schematic Diagram](/images/projects/emotion-diary.png)

## Research Outcomes
This architecture successfully bypassed traditional thermal throttling bounds on standard IoT hardware. The system is fully documented and published in the proceedings of IEEE Edge 2026.