# Structured Metadata MCP Server Features

## Overview
The Structured Metadata MCP Server provides comprehensive metadata management capabilities for Cloudinary accounts through Cloudinary's metadata APIs. It offers specialized tools for managing metadata fields and metadata rules.

---

## Available Structured Metadata Tools

### 🏷️ **Metadata Fields Management**
1. **create-metadata-field** - Creates a new metadata field in your Cloudinary account
2. **list-metadata-fields** - Lists all metadata fields defined in your Cloudinary account
3. **get-metadata-field** - Retrieves the details of a single metadata field by its external ID
4. **update-metadata-field** - Modifies an existing metadata field's configuration
5. **delete-metadata-field** - Deletes a metadata field from your Cloudinary account

### 📋 **Metadata Rules Management**
6. **create-metadata-rule** - Creates a new metadata rule for assets
7. **list-metadata-rules** - Lists all metadata rules defined in your Cloudinary account
8. **get-metadata-rule** - Retrieves the details of a single metadata rule by its ID
9. **update-metadata-rule** - Modifies an existing metadata rule's configuration
10. **delete-metadata-rule** - Deletes a metadata rule from your Cloudinary account

---

## Key Capabilities

### **Dynamic Credential Support**
- Accepts credentials per request through `__credentials__` parameter
- No hardcoded API keys or environment variables required
- Supports multiple Cloudinary accounts simultaneously

### **Comprehensive Metadata Management**
- **Metadata Fields**: Define, update, and organize custom metadata fields for assets
- **Metadata Rules**: Automate asset tagging, validation, and workflow enforcement

### **Enterprise Features**
- **Centralized Metadata Control**: Manage all asset metadata from a single interface
- **Automation**: Rule-based metadata assignment and validation
- **Scalable**: Cloudinary's enterprise-grade infrastructure

---

## Integration Benefits

### **For Content Management**
- Consistent metadata tagging across assets
- Automated metadata validation and enrichment

### **For Operations**
- Centralized metadata schema management
- Automated workflows for asset organization

---

## Usage Pattern

All structured metadata tools follow the same pattern:
```json
{
  "tool_name": "create-metadata-field",
  "args": {
    "request": {
      "external_id": "product_id",
      "label": "Product ID",
      "type": "string"
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

Structured metadata results include:
- **Metadata Details**: Complete field or rule configuration
- **Status Information**: Success/failure status and error details
- **Resource Identifiers**: Unique IDs for created/updated resources

---

**The Structured Metadata MCP Server provides centralized management of all Cloudinary asset metadata, enabling consistent and automated metadata operations across your media infrastructure.** 