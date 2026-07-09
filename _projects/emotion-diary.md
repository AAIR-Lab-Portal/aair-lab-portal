---
title: "EmotionDiary: Real-Time Emotional Telemetry"
lead: "Chau"
status: "Active"
tech: "ESP32, MQTT, Edge CNNs"
---

**EmotionDiary** is a decentralized AIoT platform designed to capture and analyze real-time human emotional telemetry using embedded edge devices. 

Instead of routing raw sensor data to a centralized cloud, which introduces latency and privacy concerns, this project utilizes **Edge-based Convolutional Neural Networks (CNNs)** to process posture and movement data directly on the device.

### Architecture Highlights
1. **Sensor Node:** An ESP32 microcontroller embedded in a seat cushion.
2. **Data Pipeline:** Telemetry is transmitted via the lightweight MQTT protocol.
3. **Inference:** The model executes locally, returning only the categorized emotional state.

This project demonstrates the viability of high-accuracy inference in extreme memory-constrained environments.