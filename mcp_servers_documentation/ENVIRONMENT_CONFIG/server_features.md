# Environment Config MCP Server Features

## Overview
The Environment Config MCP Server provides comprehensive environment configuration management capabilities for Cloudinary accounts through Cloudinary's environment configuration APIs. It offers 23 specialized tools covering streaming profiles, transformations, upload presets, upload mappings, and triggers.

---

## Available Environment Config Tools

### 📺 **Streaming Profiles Management**
1. **create-streaming-profile** - Creates a new adaptive streaming profile in your Cloudinary account
2. **list-streaming-profiles** - Lists all adaptive streaming profiles (both built-in and custom) defined in your Cloudinary account
3. **get-streaming-profile** - Retrieves the details of a single adaptive streaming profile by its name
4. **update-streaming-profile** - Modifies an existing adaptive streaming profile's configuration
5. **delete-streaming-profile** - Delete custom streaming profile or revert built-in profile to the original settings

### 🔄 **Transformations Management**
6. **create-transformation** - Creates a new transformation in your Cloudinary account
7. **list-transformations** - Lists all transformations defined in your Cloudinary account
8. **get-transformation** - Retrieves the details of a single transformation by its name
9. **update-transformation** - Modifies an existing transformation's configuration
10. **delete-transformation** - Deletes a transformation from your Cloudinary account

### 📤 **Upload Presets Management**
11. **create-upload-preset** - Creates a new upload preset with specified configuration settings
12. **list-upload-presets** - Lists all upload presets defined in your Cloudinary account
13. **get-upload-preset** - Retrieves the details of a single upload preset by its name
14. **update-upload-preset** - Modifies an existing upload preset's configuration
15. **delete-upload-preset** - Deletes an upload preset from your Cloudinary account

### 🗺️ **Upload Mappings Management**
16. **create-upload-mapping** - Creates a new upload mapping for folder structure
17. **list-upload-mappings** - Lists all upload mappings defined in your Cloudinary account
18. **get-upload-mapping** - Retrieves the details of a single upload mapping by its name
19. **update-upload-mapping** - Modifies an existing upload mapping's configuration
20. **delete-upload-mapping** - Deletes an upload mapping from your Cloudinary account

### ⚡ **Triggers Management**
21. **create-trigger** - Creates a new webhook trigger for automated actions
22. **list-triggers** - Lists all triggers defined in your Cloudinary account
23. **update-trigger** - Modifies an existing trigger's configuration
24. **delete-trigger** - Deletes a trigger from your Cloudinary account

---

## Key Capabilities

### **Dynamic Credential Support**
- Accepts credentials per request through `__credentials__` parameter
- No hardcoded API keys or environment variables required
- Supports multiple Cloudinary accounts simultaneously

### **Comprehensive Environment Management**
- **Streaming Profiles**: Adaptive video streaming configurations for different quality levels
- **Transformations**: Image and video transformation presets and settings
- **Upload Presets**: Predefined upload configurations for consistent asset handling
- **Upload Mappings**: Folder structure and organization rules
- **Triggers**: Automated webhook-based actions and workflows

### **Enterprise Features**
- **Configuration Management**: Centralized control over all environment settings
- **Preset Management**: Reusable configurations for consistent operations
- **Automation**: Trigger-based workflows for automated processing
- **Scalable**: Cloudinary's enterprise-grade infrastructure

---

## Integration Benefits

### **For Content Management**
- Consistent upload configurations across applications
- Automated transformation workflows
- Structured folder organization

### **For Video Streaming**
- Adaptive streaming profile management
- Quality optimization for different devices
- Bandwidth-efficient video delivery

### **For Development & Operations**
- Environment-specific configurations
- Automated deployment workflows
- Consistent asset processing rules

---

## Usage Pattern

All environment config tools follow the same pattern:
```json
{
  "tool_name": "create-streaming-profile",
  "args": {
    "request": {
      "name": "hd_1080p",
      "displayName": "HD 1080p",
      "representations": "[{\"transformation\":\"w_1920,h_1080,c_scale/vc_h264,br_2500k/ac_aac,abr_128k/fps_30\"}]"
    },
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

Environment config results include:
- **Configuration Details**: Complete settings and parameters
- **Status Information**: Success/failure status and error details
- **Resource Identifiers**: Unique IDs for created/updated resources
- **Validation Results**: Configuration validation and compliance status

---

**The Environment Config MCP Server provides centralized management of all Cloudinary environment settings, enabling consistent and automated configuration across your media infrastructure.** 