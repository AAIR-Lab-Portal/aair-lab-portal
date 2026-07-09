---
title: "Overcoming RAM Constraints in ESP32 Visual Pipelines"
author: "Stefan Ngo"
date: "2026-05-12"
category: "Edge AI"
---

By deploying optimized neural networks directly onto edge microcontrollers, we achieved sub-100ms latency without relying on external cloud processing. 

This paper explores the structural limitations of deploying standard TensorFlow models onto the ESP32 architecture and proposes a novel pruning methodology to reduce model footprint by 40% while only sacrificing 1.2% in classification accuracy.

### Key Findings
* **Latency Reduction:** Average response time dropped from 450ms (cloud) to 85ms (edge).
* **Power Efficiency:** Battery lifespan of the sensor node increased by a factor of 1.5x due to the elimination of continuous Wi-Fi transmission.

> "Pushing the math to the edge is no longer a hardware problem; it is a model architecture problem."

You can access the open-source pruning scripts in our lab's mutual repository.