# Analysis MCP Server Features

## Overview
The Analysis MCP Server provides comprehensive AI-powered analysis capabilities for images and media through Cloudinary's analysis APIs. It offers 16 specialized analysis tools covering AI vision, detection, moderation, and quality assessment.

---

## Available Analysis Tools

### 🔍 **AI Vision Analysis**
1. **analyzeAiVisionGeneral** - General AI vision analysis for objects, scenes, and content
2. **analyzeAiVisionModeration** - Content moderation and safety analysis  
3. **analyzeAiVisionTagging** - Automatic tagging and categorization

### 📝 **Content Analysis**
4. **analyzeCaptioning** - Auto-generate descriptive captions for images
5. **analyzeCldText** - Extract and analyze text content from images
6. **analyzeImageQuality** - Assess image quality metrics and scores

### 👗 **Specialized Detection**
7. **analyzeCldFashion** - Fashion item detection and analysis
8. **analyzeShopClassifier** - E-commerce product classification
9. **analyzeGoogleLogoDetection** - Logo and brand detection
10. **analyzeGoogleTagging** - Google's advanced tagging system

### 🎯 **Object Detection**
11. **analyzeCoco** - COCO dataset object detection (80+ categories)
12. **analyzeLvis** - LVIS dataset detection (1000+ categories)  
13. **analyzeUnidet** - Universal object detection
14. **analyzeHumanAnatomy** - Human body part and pose detection

### 🛡️ **Security & Quality**
15. **analyzeWatermarkDetection** - Detect watermarks and overlays
16. **tasksGetStatus** - Check analysis task status and progress

---

## Key Capabilities

### **Dynamic Credential Support**
- Accepts credentials per request through `__credentials__` parameter
- No hardcoded API keys or environment variables required
- Supports multiple Cloudinary accounts simultaneously

### **Comprehensive Analysis**
- **Object Detection**: 1000+ object categories via LVIS and COCO
- **Content Moderation**: Safety, appropriateness, and compliance checking
- **Text Analysis**: OCR and text content extraction
- **Quality Assessment**: Technical image quality metrics
- **Fashion & E-commerce**: Product and fashion item analysis

### **Enterprise Features**
- **Batch Processing**: Analyze multiple assets efficiently
- **Task Management**: Monitor long-running analysis jobs
- **Flexible Output**: Structured JSON responses with confidence scores
- **Scalable**: Cloudinary's enterprise-grade infrastructure

---

## Integration Benefits

### **For Content Management**
- Automatic tagging and categorization
- Content moderation and safety filtering
- Image quality assessment and optimization recommendations

### **For E-commerce**
- Product classification and attribute extraction
- Fashion item analysis and recommendations
- Brand and logo detection

### **For Security & Compliance**
- Watermark and overlay detection
- Content moderation for user-generated content
- Compliance with platform safety guidelines

---

## Usage Pattern

All analysis tools follow the same pattern:
```json
{
  "tool_name": "analyzeAiVisionGeneral",
  "args": {
    "public_id": "image_identifier",
    "__credentials__": {
      "cloudName": "your-cloud-name",
      "apiKey": "your-api-key",
      "apiSecret": "your-api-secret"
    }
  }
}
```

---

## Response Format

Analysis results include:
- **Confidence Scores**: Reliability indicators for detected elements
- **Structured Data**: Organized JSON with categories, tags, and metadata
- **Bounding Boxes**: Spatial coordinates for detected objects (where applicable)
- **Status Information**: Task progress and completion status

---

**The Analysis MCP Server transforms raw images into rich, actionable insights using Cloudinary's advanced AI analysis capabilities.** 