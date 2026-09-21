---
title: "Overcoming RAM Constraints in ESP32 Visual Pipelines"
date: "2025-11-02"
authors: "Mai Tan Ha, 103"
type: "Journal"
tags: ["Edge Computing", "Hardware"]
abstract: "Visual processing on microcontrollers is heavily constrained by SRAM. We propose an aggressive frame-buffer quantization strategy that allows standard ESP32 boards to process low-resolution object detection models without external PSRAM modules."
---

## Problem Statement
By deploying optimized neural networks directly onto edge microcontrollers, we achieved sub-100ms latency without relying on external cloud processing. However, the hardware boundaries of standard microcontrollers often result in out-of-memory (OOM) fatal panics during image buffer allocation.

## Proposed Pruning Methodology
This paper explores the structural limitations of deploying standard TensorFlow models onto the ESP32 architecture and proposes a novel pruning methodology to reduce model footprint by 40% while only sacrificing 1.2% in classification accuracy.

### Key Performance Indicators
1. **Latency Reduction:** Average response time dropped from 450ms (cloud) to 85ms (edge).
2. **Power Efficiency:** Battery lifespan of the sensor node increased by a factor of 1.5x due to the elimination of continuous Wi-Fi transmission.

> "Pushing the math to the edge is no longer a hardware problem; it is a model architecture problem."

You can access the open-source pruning scripts in our lab's mutual repository on GitHub.