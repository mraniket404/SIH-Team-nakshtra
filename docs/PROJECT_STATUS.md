# SATQUERY AI — PROJECT STATUS

## Project

SATQUERY AI

## Problem Statement

SIH26167

## Organization

Indian Space Research Organisation (ISRO)

## Theme

Space Technology

## Current Phase

PHASE 0 — PROJECT FOUNDATION

---

# Core Objective

Build an interactive agentic vision-language assistant for
multimodal remote-sensing image analysis through natural-language queries.

The system must support:

- Single Image
- Bi-Temporal Image Pair
- Optical + SAR Image Pair
- VQA
- Captioning
- Grounding
- Change Analysis
- Change VQA
- Cross-Modal Optical-SAR Analysis
- Agentic Model/Tool Selection
- Evidence
- Confidence
- Observable Execution Trace
- Downloadable Reports

---

# Production Rule

This project does NOT use:

- Fake AI results
- Hardcoded answers
- Fake confidence
- Fake evidence
- Fake change maps
- Fake benchmark scores
- Mock datasets
- Demo-only AI implementations

All final outputs must originate from real data
and actual processing/models.

---

# Current Phase

PHASE 0 — PROJECT FOUNDATION

---

# Completed

- [x] Root project structure planned
- [x] Frontend directory created
- [x] Backend directory created
- [x] AI service directory created
- [x] Data directories created
- [x] Model directories created
- [x] Output/report directories created
- [x] Documentation directory created
- [x] Environment configuration defined
- [x] Git ignore rules defined

---

# In Progress

- [ ] Initialize Git repository
- [ ] Initialize frontend
- [ ] Initialize backend
- [ ] Initialize Python AI service
- [ ] Complete architecture documentation

---

# Next

PHASE 1 — FRONTEND FOUNDATION

---

# Mandatory Requirements

## Interface

- [ ] Interactive GUI
- [ ] Natural-language query

## Single Image

- [ ] Single-image VQA
- [ ] Captioning
- [ ] Text-guided grounding

## Multi Image

- [ ] Bi-temporal change analysis
- [ ] Change description
- [ ] Change-based VQA
- [ ] Optical + SAR analysis

## Agentic System

- [ ] Query interpretation
- [ ] Input validation
- [ ] Task classification
- [ ] Model selection
- [ ] Tool execution
- [ ] Result integration

## Remote Sensing

- [ ] GeoTIFF support
- [ ] TIFF support
- [ ] CRS handling
- [ ] Geospatial metadata
- [ ] BigEarthNet adaptation

## AI

- [ ] Real VQA model
- [ ] Real captioning model
- [ ] Real grounding model
- [ ] Real change model
- [ ] Real optical-SAR analysis

## Evaluation

- [ ] VRSBench
- [ ] RSVQA
- [ ] CDVQA
- [ ] Evaluation pipeline
- [ ] Actual metrics

## Output

- [ ] Evidence
- [ ] Confidence
- [ ] Execution trace
- [ ] Downloadable reports

---

# Known Issues

None.

---

# Risks

- Large remote-sensing datasets
- GPU requirements
- Model compatibility
- GeoTIFF preprocessing complexity
- Optical-SAR registration
- Model inference latency
- Production storage requirements

---

# Architecture Rule

Do not silently remove mandatory functionality.

If a technical component is difficult:

1. Document the problem.
2. Define the interface.
3. Implement the real pipeline when feasible.
4. Test it.
5. Update this document.

Never mark an unimplemented feature as completed.