---
title: "Contextual RAG Optimization via Synthetic Data Augmentation"
date: "2026-08-15"
type: "Conference"
author_ids: [101, 104]
tags: ["ML Foundation", "Vision-Language Models"]
pdf_url: "/docs/sample-paper.pdf"
externalLink: "https://arxiv.org"
abstract: "This paper presents a novel approach to optimizing Retrieval-Augmented Generation (RAG) pipelines. By introducing synthetically generated edge cases into the embedding space, we demonstrate a 14% improvement in retrieval accuracy across imbalanced datasets."
---

## Introduction

Modern Retrieval-Augmented Generation (RAG) systems suffer from degraded performance when navigating highly imbalanced vector spaces. Standard retrieval mechanisms rely on cosine similarity, defined as:

$$ \text{similarity} = \cos(\theta) = \frac{\mathbf{A} \cdot \mathbf{B}}{\|\mathbf{A}\| \|\mathbf{B}\|} $$

When the document corpus lacks sufficient negative constraints, the model frequently hallucinates context. We propose a synthetic data injection framework to artificially populate the decision boundary.

## Methodology

Our approach utilizes a dual-encoder architecture. We process the input queries through a frozen primary encoder while a secondary, low-rank adapted (LoRA) encoder evaluates the synthetic edge cases. 

  - **Learning Rate:** $3 \times 10^{-4}$
  - **Batch Size:** 128
  - **Optimizer:** AdamW ($\beta_1 = 0.9, \beta_2 = 0.999$)
  - **Weight Decay:** 0.01


### Synthetic Generation Pipeline

The generation pipeline leverages a smaller instruction-tuned model to create counterfactual queries. If the original query is $Q$, the synthetic inverse is $Q_{inv}$. By forcing the model to distinguish between $Q$ and $Q_{inv}$, we artificially harden the retrieval parameters.

### Just Another Heading

This text serves no purpose other than to test the visibility of another heading. 

## Results

Evaluation on the standard benchmark demonstrates significant resilience against adversarial context injections. The precision-recall curve maintains a steep gradient even at high perturbation thresholds.

## Conclusion

Synthetic data augmentation provides a computationally efficient method for stabilizing RAG pipelines in production environments. Future work will explore applying complementary label learning to further refine the embedding space without requiring absolute ground truths.