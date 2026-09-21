---
title: "EmotionDiary: Embedded Telemetry for Automated Psychological Tracking"
date: "2026-04-12"
authors: "Ngo Minh Chau, [Nguyen Van An](https://arxiv.org)"
type: "Conference"
tags: ["Hardware", "Edge Computing"]
pdf_url: "/docs/emotion-diary-paper.pdf"
externalLink: "https://ieee.org/"
abstract: "This paper details the engineering of EmotionDiary, a decentralized system designed to capture, process, and act upon emotional telemetry using microcontrollers and edge AI, entirely bypassing cloud-latency bottlenecks."
---

## 1. Introduction
Real-time emotional telemetry has traditionally relied on high-bandwidth video streams sent to centralized cloud servers for heavy CNN processing. This introduces two critical points of failure: privacy vulnerabilities and latency overhead. 

In this paper, we propose shifting the mathematical burden directly to the microcontroller edge.

## 2. Hardware Architecture
The primary challenge of this deployment was securing the ESP32 array within a foam matrix without severing the I2C communication lines during physical load testing.

![Stress testing the sensor matrix under a 80kg load](/images/sensor-stress-test.png)

## 3. Quantization and Model Training
Models were trained locally on an NVIDIA A100 cluster utilizing PyTorch before being converted to TensorFlow Lite Micro arrays. The quantization process reduced the floating-point weights to 8-bit integers, allowing execution entirely within the ESP32's internal 520KB SRAM.

$$ \text{Quantized Value} = \text{round}\left(\frac{\text{Real Value}}{\text{Scale}}\right) + \text{Zero Point} $$

## 4. Conclusion
By aggressively quantizing the model, we maintained 93% accuracy while cutting response latency down to 45ms.