---
title: "AeroPulse: Micro-Climate Jet Stream Analytics"
lead: "Nguyen Minh Thuan, Le Lam Son"
date: "2026-08-24"
status: "Active"
tech: "Raspberry Pi Pico W, LoRaWAN, TinyML"
canvas_tags: ["ML Foundation", "Imbalanced Learning"]
excerpt: "An ultra-localized environmental telemetry array utilizing embedded micro-models to track urban heat islands and turbulent airflow patterns in real time."
image: "/images/projects/aeropulse.jpeg"
image_caption: "Prototype newly arranged on top of a building."

---
## System Overview
**AeroPulse** is an ultra-localized environmental telemetry array engineered to monitor micro-climate fluctuations and urban heat islands. 

Rather than sending high-frequency sensor readings to distant cloud servers, which drains local battery reserves and creates data bottlenecks, the system leverages **TinyML anomaly detection models** running directly on edge nodes to process atmospheric pressure and thermodynamic data.

## Architecture Highlights
1. **Sensor Node:** A solar-assisted Raspberry Pi Pico W node equipped with barometric and relative humidity sensors.
2. **Data Pipeline:** Compressed anomalies and critical status alerts are transmitted across long distances using the ultra-low-power LoRaWAN protocol.
3. **Inference Engine:** A vectorized temporal convolutional model processes moving windows of data on-chip, transmitting data updates only when environmental shifts cross dynamic thresholds.

## Current Milestones
This project validates the field durability of decentralized mesh networks under harsh weather conditions. We are currently evaluating the power harvesting efficiency of our custom micro-solar arrays during extended multi-day overcast periods.

