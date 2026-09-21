---
title: "A Hardware View on Emotion Tracking"
date: "2026-04-12"
author_ids: [104]
type: "Thesis"
tags: ["Hardware", "Edge Computing"]
abstract: "An undergraduate thesis detailing the engineering of EmotionDiary, a decentralized system designed to capture, process, and act upon emotional telemetry using microcontrollers and edge AI."
---

## Abstract Overview
This thesis outlines the full end-to-end engineering lifecycle of the EmotionDiary hardware initiative. It covers the initial schematic designs, the C++ firmware development, and the eventual deployment of the Edge CNNs.

## Hardware Fabrication
The primary challenge of this thesis was securing the ESP32 array within a foam matrix without severing the I2C communication lines during physical load testing.

## Model Training
Models were trained locally on an NVIDIA A100 cluster utilizing PyTorch before being converted to TensorFlow Lite Micro arrays. The quantization process reduced the floating-point weights to 8-bit integers, allowing execution entirely within the ESP32's internal SRAM.