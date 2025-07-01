# Analysis MCP Server - Adya Hackathon Integration

## 🚀 Adya Hackathon Platform Integration

This Analysis MCP Server has been integrated into the **Adya Hackathon Platform** with the following key enhancements:

### ✅ **Dynamic Credential Handling**
- **No hardcoded credentials**: All credentials passed dynamically per request
- **`__credentials__` parameter**: Automatic injection into all tool calls
- **Multi-account support**: Different Cloudinary accounts per request
- **Secure**: No environment variables or configuration files required

### ✅ **Platform Integration**
- **MCP Client Support**: Works with OpenAI, Gemini, Azure AI, and other clients
- **Tool Discovery**: All 16 analysis tools automatically available
- **Error Handling**: Robust error handling and credential validation
- **Startup Script**: `start-server.js` for seamless server launch

### ✅ **Available Analysis Tools (16 total)**
1. **AI Vision**: General, Moderation, Tagging
2. **Content Analysis**: Captioning, Text, Image Quality
3. **Object Detection**: COCO, LVIS, Human Anatomy, Unidet
4. **Specialized**: Fashion, Shop Classifier, Logo Detection
5. **Security**: Watermark Detection, Task Status

---

# Original Cloudinary Analysis JS SDK Documentation

<!-- Start Summary [summary] -->
## Summary

Analyze API (Beta): Use the Analyze API to analyze any external asset and return details based on the type of analysis requested.

Currently supports the following analysis options:
  * [AI Vision - Tagging](https://cloudinary.com/documentation/cloudinary_ai_vision_addon#tagging_mode)
  * [AI Vision - Moderation](https://cloudinary.com/documentation/cloudinary_ai_vision_addon#moderation_mode)
  * [AI Vision - General](https://cloudinary.com/documentation/cloudinary_ai_vision_addon#general_mode)
  * [Captioning](https://cloudinary.com/documentation/cloudinary_ai_content_analysis_addon#ai_based_image_captioning)
  * [Cld Fashion](https://cloudinary.com/documentation/cloudinary_ai_content_analysis_addon#supported_content_aware_detection_models)
  * [Cld Text](https://cloudinary.com/documentation/cloudinary_ai_content_analysis_addon#supported_content_aware_detection_models)
  * [Coco](https://cloudinary.com/documentation/cloudinary_ai_content_analysis_addon#supported_content_aware_detection_models)
  * [Google Tagging](https://cloudinary.com/documentation/google_auto_tagging_addon)
  * [Human Anatomy](https://cloudinary.com/documentation/cloudinary_ai_content_analysis_addon#supported_content_aware_detection_models)
  * [Image Quality Analysis](https://cloudinary.com/documentation/cloudinary_ai_content_analysis_addon#image_quality_analysis)
  * [Lvis](https://cloudinary.com/documentation/cloudinary_ai_content_analysis_addon#supported_content_aware_detection_models)
  * [Shop Classifier](https://cloudinary.com/documentation/cloudinary_ai_content_analysis_addon#supported_content_aware_detection_models)
  * [Unidet](https://cloudinary.com/documentation/cloudinary_ai_content_analysis_addon#supported_content_aware_detection_models)
  * [Watermark Detection](https://cloudinary.com/documentation/cloudinary_ai_content_analysis_addon#watermark_detection)

  **Notes**: 
  * The Analyze API is currently in development and is available as a Public Beta, which means we value your feedback, so please feel free to [share any thoughts with us](https://support.cloudinary.com/hc/en-us/requests/new).
  * The analysis options require an active subscription to the relevant add-on. Learn more about [registering for add-ons](https://cloudinary.com/documentation/cloudinary_add_ons#registering_for_add_ons).

  The API supports both Basic Authentication using your Cloudinary API Key and API Secret (which can be found on the Dashboard page of your [Cloudinary Console](https://console.cloudinary.com/pm)) or OAuth2 ([Contact support](https://support.cloudinary.com/hc/en-us/requests/new) for more information regarding OAuth).
<!-- End Summary [summary] -->

<!-- Start Table of Contents [toc] -->
## Table of Contents
<!-- $toc-max-depth=2 -->
* [Cloudinary Analysis JS SDK](#cloudinary-analysis-js-sdk)
  * [SDK Installation](#sdk-installation)
  * [Requirements](#requirements)
  * [SDK Example Usage](#sdk-example-usage)
  * [Server Selection](#server-selection)
  * [Authentication](#authentication)
  * [Available Resources and Operations](#available-resources-and-operations)
  * [Standalone functions](#standalone-functions)
  * [Retries](#retries)
  * [Error Handling](#error-handling)
  * [Custom HTTP Client](#custom-http-client)
  * [Debugging](#debugging)
* [Development](#development)
  * [Maturity](#maturity)
  * [Contributions](#contributions)

<!-- End Table of Contents [toc] -->

## SDK Installation

The SDK can be installed with either [npm](https://www.npmjs.com/), [pnpm](https://pnpm.io/), [bun](https://bun.sh/) or [yarn](https://classic.yarnpkg.com/en/) package managers.

### NPM

```bash
npm add @cloudinary/analysis
```

### PNPM

```bash
pnpm add @cloudinary/analysis
```

### Bun

```bash
bun add @cloudinary/analysis
```

### Yarn

```bash
yarn add @cloudinary/analysis zod

# Note that Yarn does not install peer dependencies automatically. You will need
# to install zod as shown above.
```



### Model Context Protocol (MCP) Server

This SDK is also an installable MCP server where the various SDK methods are
exposed as tools that can be invoked by AI applications.

> Node.js v20 or greater is required to run the MCP server from npm.

<details>
<summary>Claude installation steps</summary>

Add the following server definition to your `claude_desktop_config.json` file:

```json
{
  "mcpServers": {
    "CloudinaryAnalysis": {
      "command": "npx",
      "args": [
        "-y", "--package", "@cloudinary/analysis",
        "--",
        "mcp", "start",
        "--cloud-name", "...",
        "--api-key", "...",
        "--api-secret", "..."
      ]
    }
  }
}
```

</details>

<details>
<summary>Cursor installation steps</summary>

Create a `.cursor/mcp.json` file in your project root with the following content:

```json
{
  "mcpServers": {
    "CloudinaryAnalysis": {
      "command": "npx",
      "args": [
        "-y", "--package", "@cloudinary/analysis",
        "--",
        "mcp", "start",
        "--cloud-name", "...",
        "--api-key", "...",
        "--api-secret", "..."
      ]
    }
  }
}
```

</details>

You can also run MCP servers as a standalone binary with no additional dependencies. You must pull these binaries from available Github releases:

```bash
curl -L -o mcp-server \
    https://github.com/cloudinary/analysis-js/releases/download/{tag}/mcp-server-bun-darwin-arm64 && \
chmod +x mcp-server
```

For a full list of server arguments, run:

```sh
npx -y --package @cloudinary/analysis -- mcp start --help
```
<!-- No SDK Installation [installation] -->

<!-- Start Requirements [requirements] -->
## Requirements

For supported JavaScript runtimes, please consult [RUNTIMES.md](RUNTIMES.md).
<!-- End Requirements [requirements] -->

<!-- Start SDK Example Usage [usage] -->
## SDK Example Usage

### Example

```typescript
import { CloudinaryAnalysis } from "@cloudinary/analysis";

const cloudinaryAnalysis = new CloudinaryAnalysis({
  security: {
    cloudinaryAuth: {
      apiKey: "CLOUDINARY_API_KEY",
      apiSecret: "CLOUDINARY_API_SECRET",
    },
  },
});

async function run() {
  const result = await cloudinaryAnalysis.analyze.aiVisionGeneral({
    source: {
      uri: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
    },
    prompts: [
      "Describe this image in detail",
      "Does this image contain an insect?",
    ],
  });

  console.log(result);
}

run();

```
<!-- End SDK Example Usage [usage] -->

<!-- Start Server Selection [server] -->
## Server Selection

### Server Variables

The default server `https://api.cloudinary.com/v2/analysis/{cloud_name}` contains variables and is set to `https://api.cloudinary.com/v2/analysis/CLOUD_NAME` by default. To override default values, the following parameters are available when initializing the SDK client instance:

| Variable     | Parameter           | Default        | Description      |
| ------------ | ------------------- | -------------- | ---------------- |
| `cloud_name` | `cloudName: string` | `"CLOUD_NAME"` | Your Cloud Name. |

#### Example

```typescript
import { CloudinaryAnalysis } from "@cloudinary/analysis";

const cloudinaryAnalysis = new CloudinaryAnalysis({
  cloudName: "<value>",
  security: {
    cloudinaryAuth: {
      apiKey: "CLOUDINARY_API_KEY",
      apiSecret: "CLOUDINARY_API_SECRET",
    },
  },
});

async function run() {
  const result = await cloudinaryAnalysis.analyze.aiVisionGeneral({
    source: {
      uri: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
    },
    prompts: [
      "Describe this image in detail",
      "Does this image contain an insect?",
    ],
  });

  console.log(result);
}

run();

```

### Override Server URL Per-Client

The default server can be overridden globally by passing a URL to the `serverURL: string` optional parameter when initializing the SDK client instance. For example:
```typescript
import { CloudinaryAnalysis } from "@cloudinary/analysis";

const cloudinaryAnalysis = new CloudinaryAnalysis({
  serverURL: "https://api.cloudinary.com/v2/analysis/CLOUD_NAME",
  security: {
    cloudinaryAuth: {
      apiKey: "CLOUDINARY_API_KEY",
      apiSecret: "CLOUDINARY_API_SECRET",
    },
  },
});

async function run() {
  const result = await cloudinaryAnalysis.analyze.aiVisionGeneral({
    source: {
      uri: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
    },
    prompts: [
      "Describe this image in detail",
      "Does this image contain an insect?",
    ],
  });

  console.log(result);
}

run();

```
<!-- End Server Selection [server] -->

<!-- Start Authentication [security] -->
## Authentication

### Per-Client Security Schemes

This SDK supports the following security schemes globally:

| Name             | Type   | Scheme       | Environment Variable         |
| ---------------- | ------ | ------------ | ---------------------------- |
| `cloudinaryAuth` | http   | Custom HTTP  | `CLOUDINARY_CLOUDINARY_AUTH` |
| `oAuth2`         | oauth2 | OAuth2 token | `CLOUDINARY_O_AUTH2`         |

You can set the security parameters through the `security` optional parameter when initializing the SDK client instance. The selected scheme will be used by default to authenticate with the API for all operations that support it. For example:
```typescript
import { CloudinaryAnalysis } from "@cloudinary/analysis";

const cloudinaryAnalysis = new CloudinaryAnalysis({
  security: {
    cloudinaryAuth: {
      apiKey: "CLOUDINARY_API_KEY",
      apiSecret: "CLOUDINARY_API_SECRET",
    },
  },
});

async function run() {
  const result = await cloudinaryAnalysis.analyze.aiVisionGeneral({
    source: {
      uri: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
    },
    prompts: [
      "Describe this image in detail",
      "Does this image contain an insect?",
    ],
  });

  console.log(result);
}

run();

```
<!-- End Authentication [security] -->

<!-- Start Available Resources and Operations [operations] -->
## Available Resources and Operations

<details open>
<summary>Available methods</summary>

### [analyze](docs/sdks/analyze/README.md)

* [aiVisionGeneral](docs/sdks/analyze/README.md#aivisiongeneral) - Analyze - AI Vision General
* [aiVisionModeration](docs/sdks/analyze/README.md#aivisionmoderation) - Analyze - AI Vision Moderation
* [aiVisionTagging](docs/sdks/analyze/README.md#aivisiontagging) - Analyze - AI Vision Tagging
* [captioning](docs/sdks/analyze/README.md#captioning) - Analyze - Captioning
* [cldFashion](docs/sdks/analyze/README.md#cldfashion) - Analyze - Cld-Fashion
* [cldText](docs/sdks/analyze/README.md#cldtext) - Analyze - Cld-Text
* [coco](docs/sdks/analyze/README.md#coco) - Analyze - Coco
* [googleLogoDetection](docs/sdks/analyze/README.md#googlelogodetection) - Analyze - Google Logo Detection
* [googleTagging](docs/sdks/analyze/README.md#googletagging) - Analyze - Google Tagging
* [humanAnatomy](docs/sdks/analyze/README.md#humananatomy) - Analyze - Human Anatomy
* [imageQuality](docs/sdks/analyze/README.md#imagequality) - Analyze - Image Quality Analysis
* [lvis](docs/sdks/analyze/README.md#lvis) - Analyze - Lvis
* [shopClassifier](docs/sdks/analyze/README.md#shopclassifier) - Analyze - Shop Classifier
* [unidet](docs/sdks/analyze/README.md#unidet) - Analyze - Unidet
* [watermarkDetection](docs/sdks/analyze/README.md#watermarkdetection) - Analyze - Watermark Detection


### [tasks](docs/sdks/tasks/README.md)

* [getStatus](docs/sdks/tasks/README.md#getstatus) - Get analysis task status

</details>
<!-- End Available Resources and Operations [operations] -->

<!-- Start Standalone functions [standalone-funcs] -->
## Standalone functions

All the methods listed above are available as standalone functions. These
functions are ideal for use in applications running in the browser, serverless
runtimes or other environments where application bundle size is a primary
concern. When using a bundler to build your application, all unused
functionality will be either excluded from the final bundle or tree-shaken away.

To read more about standalone functions, check [FUNCTIONS.md](./FUNCTIONS.md).

<details>

<summary>Available standalone functions</summary>

- [`analyzeAiVisionGeneral`](docs/sdks/analyze/README.md#aivisiongeneral) - Analyze - AI Vision General
- [`analyzeAiVisionModeration`](docs/sdks/analyze/README.md#aivisionmoderation) - Analyze - AI Vision Moderation
- [`analyzeAiVisionTagging`](docs/sdks/analyze/README.md#aivisiontagging) - Analyze - AI Vision Tagging
- [`analyzeCaptioning`](docs/sdks/analyze/README.md#captioning) - Analyze - Captioning
- [`analyzeCldFashion`](docs/sdks/analyze/README.md#cldfashion) - Analyze - Cld-Fashion
- [`analyzeCldText`](docs/sdks/analyze/README.md#cldtext) - Analyze - Cld-Text
- [`analyzeCoco`](docs/sdks/analyze/README.md#coco) - Analyze - Coco
- [`analyzeGoogleLogoDetection`](docs/sdks/analyze/README.md#googlelogodetection) - Analyze - Google Logo Detection
- [`analyzeGoogleTagging`](docs/sdks/analyze/README.md#googletagging) - Analyze - Google Tagging
- [`analyzeHumanAnatomy`](docs/sdks/analyze/README.md#humananatomy) - Analyze - Human Anatomy
- [`analyzeImageQuality`](docs/sdks/analyze/README.md#imagequality) - Analyze - Image Quality Analysis
- [`analyzeLvis`](docs/sdks/analyze/README.md#lvis) - Analyze - Lvis
- [`analyzeShopClassifier`](docs/sdks/analyze/README.md#shopclassifier) - Analyze - Shop Classifier
- [`analyzeUnidet`](docs/sdks/analyze/README.md#unidet) - Analyze - Unidet
- [`analyzeWatermarkDetection`](docs/sdks/analyze/README.md#watermarkdetection) - Analyze - Watermark Detection
- [`tasksGetStatus`](docs/sdks/tasks/README.md#getstatus) - Get analysis task status

</details>
<!-- End Standalone functions [standalone-funcs] -->

<!-- Start Retries [retries] -->
## Retries

Some of the endpoints in this SDK support retries.  If you use the SDK without any configuration, it will fall back to the default retry strategy provided by the API.  However, the default retry strategy can be overridden on a per-operation basis, or across the entire SDK.

To change the default retry strategy for a single API call, simply provide a retryConfig object to the call:
```typescript
import { CloudinaryAnalysis } from "@cloudinary/analysis";

const cloudinaryAnalysis = new CloudinaryAnalysis({
  security: {
    cloudinaryAuth: {
      apiKey: "CLOUDINARY_API_KEY",
      apiSecret: "CLOUDINARY_API_SECRET",
    },
  },
});

async function run() {
  const result = await cloudinaryAnalysis.analyze.aiVisionGeneral({
    source: {
      uri: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
    },
    prompts: [
      "Describe this image in detail",
      "Does this image contain an insect?",
    ],
  }, {
    retries: {
      strategy: "backoff",
      backoff: {
        initialInterval: 1,
        maxInterval: 50,
        exponent: 1.1,
        maxElapsedTime: 100,
      },
      retryConnectionErrors: false,
    },
  });

  console.log(result);
}

run();

```

If you'd like to override the default retry strategy for all operations that support retries, you can provide a retryConfig at SDK initialization:
```typescript
import { CloudinaryAnalysis } from "@cloudinary/analysis";

const cloudinaryAnalysis = new CloudinaryAnalysis({
  retryConfig: {
    strategy: "backoff",
    backoff: {
      initialInterval: 1,
      maxInterval: 50,
      exponent: 1.1,
      maxElapsedTime: 100,
    },
    retryConnectionErrors: false,
  },
  security: {
    cloudinaryAuth: {
      apiKey: "CLOUDINARY_API_KEY",
      apiSecret: "CLOUDINARY_API_SECRET",
    },
  },
});

async function run() {
  const result = await cloudinaryAnalysis.analyze.aiVisionGeneral({
    source: {
      uri: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
    },
    prompts: [
      "Describe this image in detail",
      "Does this image contain an insect?",
    ],
  });

  console.log(result);
}

run();

```
<!-- End Retries [retries] -->

<!-- Start Error Handling [errors] -->
## Error Handling

[`CloudinaryAnalysisError`](./src/models/errors/cloudinaryanalysiserror.ts) is the base class for all HTTP error responses. It has the following properties:

| Property            | Type       | Description                                                                             |
| ------------------- | ---------- | --------------------------------------------------------------------------------------- |
| `error.message`     | `string`   | Error message                                                                           |
| `error.statusCode`  | `number`   | HTTP response status code eg `404`                                                      |
| `error.headers`     | `Headers`  | HTTP response headers                                                                   |
| `error.body`        | `string`   | HTTP body. Can be empty string if no body is returned.                                  |
| `error.rawResponse` | `Response` | Raw HTTP response                                                                       |
| `error.data$`       |            | Optional. Some errors may contain structured data. [See Error Classes](#error-classes). |

### Example
```typescript
import { CloudinaryAnalysis } from "@cloudinary/analysis";
import * as errors from "@cloudinary/analysis/models/errors";

const cloudinaryAnalysis = new CloudinaryAnalysis({
  security: {
    cloudinaryAuth: {
      apiKey: "CLOUDINARY_API_KEY",
      apiSecret: "CLOUDINARY_API_SECRET",
    },
  },
});

async function run() {
  try {
    const result = await cloudinaryAnalysis.analyze.aiVisionGeneral({
      source: {
        uri: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
      },
      prompts: [
        "Describe this image in detail",
        "Does this image contain an insect?",
      ],
    });

    console.log(result);
  } catch (error) {
    // The base class for HTTP error responses
    if (error instanceof errors.CloudinaryAnalysisError) {
      console.log(error.message);
      console.log(error.statusCode);
      console.log(error.body);
      console.log(error.headers);

      // Depending on the method different errors may be thrown
      if (error instanceof errors.ErrorResponse) {
        console.log(error.data$.error); // components.ErrorObject
      }
    }
  }
}

run();

```

### Error Classes
**Primary errors:**
* [`CloudinaryAnalysisError`](./src/models/errors/cloudinaryanalysiserror.ts): The base class for HTTP error responses.
  * [`ErrorResponse`](docs/models/errors/errorresponse.md): Bad request.
  * [`RateLimitedResponseError`](docs/models/errors/ratelimitedresponseerror.md): Rate limited. Status code `429`.

<details><summary>Less common errors (6)</summary>

<br />

**Network errors:**
* [`ConnectionError`](./src/models/errors/httpclienterrors.ts): HTTP client was unable to make a request to a server.
* [`RequestTimeoutError`](./src/models/errors/httpclienterrors.ts): HTTP request timed out due to an AbortSignal signal.
* [`RequestAbortedError`](./src/models/errors/httpclienterrors.ts): HTTP request was aborted by the client.
* [`InvalidRequestError`](./src/models/errors/httpclienterrors.ts): Any input used to create a request is invalid.
* [`UnexpectedClientError`](./src/models/errors/httpclienterrors.ts): Unrecognised or unexpected error.


**Inherit from [`CloudinaryAnalysisError`](./src/models/errors/cloudinaryanalysiserror.ts)**:
* [`ResponseValidationError`](./src/models/errors/responsevalidationerror.ts): Type mismatch between the data returned from the server and the structure expected by the SDK. See `error.rawValue` for the raw value and `error.pretty()` for a nicely formatted multi-line string.

</details>
<!-- End Error Handling [errors] -->

<!-- Start Custom HTTP Client [http-client] -->
## Custom HTTP Client

The TypeScript SDK makes API calls using an `HTTPClient` that wraps the native
[Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API). This
client is a thin wrapper around `fetch` and provides the ability to attach hooks
around the request lifecycle that can be used to modify the request or handle
errors and response.

The `HTTPClient` constructor takes an optional `fetcher` argument that can be
used to integrate a third-party HTTP client or when writing tests to mock out
the HTTP client and feed in fixtures.

The following example shows how to use the `"beforeRequest"` hook to to add a
custom header and a timeout to requests and how to use the `"requestError"` hook
to log errors:

```typescript
import { CloudinaryAnalysis } from "@cloudinary/analysis";
import { HTTPClient } from "@cloudinary/analysis/lib/http";

const httpClient = new HTTPClient({
  // fetcher takes a function that has the same signature as native `fetch`.
  fetcher: (request) => {
    return fetch(request);
  }
});

httpClient.addHook("beforeRequest", (request) => {
  const nextRequest = new Request(request, {
    signal: request.signal || AbortSignal.timeout(5000)
  });

  nextRequest.headers.set("x-custom-header", "custom value");

  return nextRequest;
});

httpClient.addHook("requestError", (error, request) => {
  console.group("Request Error");
  console.log("Reason:", `${error}`);
  console.log("Endpoint:", `${request.method} ${request.url}`);
  console.groupEnd();
});

const sdk = new CloudinaryAnalysis({ httpClient });
```
<!-- End Custom HTTP Client [http-client] -->

<!-- Start Debugging [debug] -->
## Debugging

You can setup your SDK to emit debug logs for SDK requests and responses.

You can pass a logger that matches `console`'s interface as an SDK option.

> [!WARNING]
> Beware that debug logging will reveal secrets, like API tokens in headers, in log messages printed to a console or files. It's recommended to use this feature only during local development and not in production.

```typescript
import { CloudinaryAnalysis } from "@cloudinary/analysis";

const sdk = new CloudinaryAnalysis({ debugLogger: console });
```

You can also enable a default debug logger by setting an environment variable `CLOUDINARY_DEBUG` to true.
<!-- End Debugging [debug] -->

<!-- Placeholder for Future Speakeasy SDK Sections -->

# Development

## Maturity

This SDK is in beta, and there may be breaking changes between versions without a major version update. Therefore, we recommend pinning usage
to a specific package version. This way, you can install the same version each time without breaking changes unless you are intentionally
looking for the latest version.

## Contributions

While we value open-source contributions to this SDK, this library is generated programmatically. Any manual changes added to internal files will be overwritten on the next generation. 
We look forward to hearing your feedback. Feel free to open a PR or an issue with a proof of concept and we'll do our best to include it in a future release. 

### SDK Created by [Speakeasy](https://www.speakeasy.com/?utm_source=cloudinary-analysis&utm_campaign=typescript)
