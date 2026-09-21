---
title: "UAV Swarm Pathfinding Module"
date: "2023-11-01"
lead: "Mai Tan Ha"
status: "Inactive"
tech: "ROS, Python, OpenCV"
canvas_tags: ["Vision-Language Models"]
excerpt: "Exploratory drone navigation framework. Development halted due to hardware payload constraints. Repository preserved for reference."
---

## Exploratory Phase
This module was initiated to test the feasibility of distributing vision-language processing across a localized swarm of low-cost UAVs. The primary engine was built on ROS (Robot Operating System) with an OpenCV bridge for spatial mapping.

## Hardware Bottlenecks
During physical flight testing, the onboard processing requirements for the multi-modal reasoning models exceeded the thermal and battery capacities of the payload. The drones experienced severe voltage drops during mid-flight inference spikes.

## Development Halt
As of Q4 2023, development on this specific swarm architecture has been halted. The codebase remains preserved in the lab's repository for future reference should lighter-weight vision models become available.