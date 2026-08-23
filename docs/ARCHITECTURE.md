# SATQUERY AI — SYSTEM ARCHITECTURE

## 1. Overview

SATQUERY AI is an agentic remote-sensing AI platform.

The user provides:

1. Satellite imagery
2. Natural-language query

The system then:

1. Inspects the input
2. Validates compatibility
3. Interprets the query
4. Determines the required task
5. Selects appropriate specialist model/tools
6. Executes the analysis
7. Validates outputs
8. Generates evidence
9. Produces confidence information
10. Returns an evidence-grounded response
11. Records an observable execution trace
12. Generates a report

---

# 2. High-Level Architecture

User
  |
  v
React + Vite
  |
  v
Node.js + Express
  |
  +---- MongoDB
  |
  +---- File Storage
  |
  v
Python + FastAPI
  |
  v
Agent Controller
  |
  +---- Query Interpretation
  |
  +---- Input Validation
  |
  +---- Task Classification
  |
  +---- Model Registry
  |
  +---- Tool Selection
  |
  +---- Model Execution
  |
  +---- Result Integration
  |
  v
Evidence + Confidence + Execution Trace
  |
  v
React Analysis Result
  |
  v
Report

---

# 3. Frontend

Technology:

- React
- Vite
- JSX
- React Router
- Axios
- React Hooks
- Context API where required
- Tailwind CSS through CDN

The frontend must not select AI models.

The frontend only sends user intent and input configuration
to the backend.

---

# 4. Backend

Technology:

- Node.js
- Express
- MongoDB

Responsibilities:

- Authentication
- Authorization
- Project management
- Image metadata
- Analysis requests
- AI service communication
- History
- Reports
- Audit logs

---

# 5. AI Service

Technology:

- Python
- FastAPI
- PyTorch
- Transformers
- OpenCV
- NumPy
- Rasterio
- GDAL where required

Responsibilities:

- Remote-sensing preprocessing
- Query routing
- Model selection
- VQA
- Captioning
- Grounding
- Change analysis
- Optical-SAR analysis
- Evidence generation
- Confidence handling

---

# 6. Agent Controller

The controller receives:

- Query
- Input count
- Image modality
- Metadata
- Analysis mode

It determines:

- Task
- Required specialist model(s)
- Required processing tools
- Permitted parameters

The controller returns structured execution information.

---

# 7. Model Registry

Each model must contain:

- Name
- Task
- Modality
- Input type
- Output type
- Capabilities
- Version
- Status

Example tasks:

- VQA
- Captioning
- Grounding
- Change Analysis
- Change VQA
- Optical-SAR Analysis

---

# 8. Supported Input Modes

## Single Image

Supported:

- Optical
- Multispectral
- SAR

Tasks:

- VQA
- Captioning
- Grounding

## Bi-Temporal

Input:

- Image T1
- Image T2

Tasks:

- Change detection
- Change description
- Change VQA

## Optical + SAR

Input:

- Optical/multispectral image
- SAR image

Tasks:

- Optical analysis
- SAR analysis
- Cross-modal analysis

---

# 9. Geospatial Processing

For GeoTIFF/TIFF inputs inspect:

- Width
- Height
- Bands
- CRS
- Transform
- Bounds
- Resolution
- Metadata

Preserve geospatial information wherever possible.

---

# 10. Evidence

Evidence may include:

- Bounding boxes
- Segmentation masks
- Change maps
- Highlighted regions
- Image crops
- Geographic coordinates

Evidence must originate from actual model/pipeline output.

---

# 11. Confidence

Confidence must originate from the actual model/pipeline
when available.

Do not randomly generate confidence values.

---

# 12. Execution Trace

The application should expose only observable execution steps.

Example:

Query received
      ↓
Input validated
      ↓
Task identified
      ↓
Model selected
      ↓
Analysis executed
      ↓
Evidence generated
      ↓
Result validated
      ↓
Response prepared

Hidden chain-of-thought must never be exposed.

---

# 13. Data Flow

Satellite Image
      ↓
Upload
      ↓
Metadata Extraction
      ↓
Compatibility Validation
      ↓
Query Analysis
      ↓
Task Selection
      ↓
Model Selection
      ↓
Preprocessing
      ↓
Inference
      ↓
Post-processing
      ↓
Evidence
      ↓
Confidence
      ↓
Final Answer
      ↓
Report