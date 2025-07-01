# Cloudinary Environment Config JS SDK

<!-- Start Summary [summary] -->
## Summary


<!-- End Summary [summary] -->

<!-- Start Table of Contents [toc] -->
## Table of Contents
<!-- $toc-max-depth=2 -->
* [Cloudinary Environment Config JS SDK](#cloudinary-environment-config-js-sdk)
  * [SDK Installation](#sdk-installation)
  * [Requirements](#requirements)
  * [SDK Example Usage](#sdk-example-usage)
  * [Global Parameters](#global-parameters)
  * [Authentication](#authentication)
  * [Available Resources and Operations](#available-resources-and-operations)
  * [Standalone functions](#standalone-functions)
  * [Retries](#retries)
  * [Error Handling](#error-handling)
  * [Server Selection](#server-selection)
  * [Custom HTTP Client](#custom-http-client)
  * [Debugging](#debugging)

<!-- End Table of Contents [toc] -->

## SDK Installation

The SDK can be installed with either [npm](https://www.npmjs.com/), [pnpm](https://pnpm.io/), [bun](https://bun.sh/) or [yarn](https://classic.yarnpkg.com/en/) package managers.

### NPM

```bash
npm add @cloudinary/environment-config
```

### PNPM

```bash
pnpm add @cloudinary/environment-config
```

### Bun

```bash
bun add @cloudinary/environment-config
```

### Yarn

```bash
yarn add @cloudinary/environment-config zod

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
    "cloudinary-env-config": {
      "command": "npx",
      "args": [
        "-y", "--package", "@cloudinary/environment-config",
        "--",
        "mcp", "start",
        "--api-key", "...",
        "--api-secret", "...",
        "--cloud-name", "..."
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
    "cloudinary-env-config": {
      "command": "npx",
      "args": [
        "-y", "--package", "@cloudinary/environment-config",
        "--",
        "mcp", "start",
        "--api-key", "...",
        "--api-secret", "...",
        "--cloud-name", "..."
      ]
    }
  }
}
```

</details>

You can also run MCP servers as a standalone binary with no additional dependencies. You must pull these binaries from available Github releases:

```bash
curl -L -o mcp-server \
    https://github.com/cloudinary/environment-config-js/releases/download/{tag}/mcp-server-bun-darwin-arm64 && \
chmod +x mcp-server
```

For a full list of server arguments, run:

```sh
npx -y --package @cloudinary/environment-config -- mcp start --help
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
import { CloudinaryEnvConfig } from "@cloudinary/environment-config";

const cloudinaryEnvConfig = new CloudinaryEnvConfig({
  cloudName: "<value>",
  security: {
    cloudinaryAuth: {
      apiKey: "CLOUDINARY_API_KEY",
      apiSecret: "CLOUDINARY_API_SECRET",
    },
  },
});

async function run() {
  const result = await cloudinaryEnvConfig.transformations.listTransformations(
    20,
    "8edbc61040178db60b0973ca9494bf3a",
  );

  console.log(result);
}

run();

```
<!-- End SDK Example Usage [usage] -->

<!-- Start Global Parameters [global-parameters] -->
## Global Parameters

A parameter is configured globally. This parameter may be set on the SDK client instance itself during initialization. When configured as an option during SDK initialization, This global value will be used as the default on the operations that use it. When such operations are called, there is a place in each to override the global value, if needed.

For example, you can set `cloud_name` to `"<value>"` at SDK initialization and then you do not have to pass the same value on calls to operations like `listTransformations`. But if you want to do so you may, which will locally override the global setting. See the example code below for a demonstration.


### Available Globals

The following global parameter is available.
Global parameters can also be set via environment variable.

| Name      | Type   | Description                                 | Environment           |
| --------- | ------ | ------------------------------------------- | --------------------- |
| cloudName | string | The cloud name of your product environment. | CLOUDINARY_CLOUD_NAME |

### Example

```typescript
import { CloudinaryEnvConfig } from "@cloudinary/environment-config";

const cloudinaryEnvConfig = new CloudinaryEnvConfig({
  cloudName: "<value>",
  security: {
    cloudinaryAuth: {
      apiKey: "CLOUDINARY_API_KEY",
      apiSecret: "CLOUDINARY_API_SECRET",
    },
  },
});

async function run() {
  const result = await cloudinaryEnvConfig.transformations.listTransformations(
    20,
    "8edbc61040178db60b0973ca9494bf3a",
  );

  console.log(result);
}

run();

```
<!-- End Global Parameters [global-parameters] -->

<!-- Start Authentication [security] -->
## Authentication

### Per-Client Security Schemes

This SDK supports the following security schemes globally:

| Name             | Type   | Scheme       | Environment Variable         |
| ---------------- | ------ | ------------ | ---------------------------- |
| `cloudinaryAuth` | http   | Custom HTTP  | `CLOUDINARY_CLOUDINARY_AUTH` |
| `oauth2`         | oauth2 | OAuth2 token | `CLOUDINARY_OAUTH2`          |

You can set the security parameters through the `security` optional parameter when initializing the SDK client instance. The selected scheme will be used by default to authenticate with the API for all operations that support it. For example:
```typescript
import { CloudinaryEnvConfig } from "@cloudinary/environment-config";

const cloudinaryEnvConfig = new CloudinaryEnvConfig({
  security: {
    cloudinaryAuth: {
      apiKey: "CLOUDINARY_API_KEY",
      apiSecret: "CLOUDINARY_API_SECRET",
    },
  },
  cloudName: "<value>",
});

async function run() {
  const result = await cloudinaryEnvConfig.transformations.listTransformations(
    20,
    "8edbc61040178db60b0973ca9494bf3a",
  );

  console.log(result);
}

run();

```
<!-- End Authentication [security] -->

<!-- Start Available Resources and Operations [operations] -->
## Available Resources and Operations

<details open>
<summary>Available methods</summary>


### [streamingProfiles](docs/sdks/streamingprofiles/README.md)

* [createStreamingProfile](docs/sdks/streamingprofiles/README.md#createstreamingprofile) - Creates a new adaptive streaming profile in your Cloudinary account
* [getStreamingProfiles](docs/sdks/streamingprofiles/README.md#getstreamingprofiles) - Lists all adaptive streaming profiles (both built-in and custom) defined in your Cloudinary account
* [getStreamingProfile](docs/sdks/streamingprofiles/README.md#getstreamingprofile) - Retrieves the details of a single adaptive streaming profile by its name
* [updateStreamingProfile](docs/sdks/streamingprofiles/README.md#updatestreamingprofile) - Modifies an existing adaptive streaming profile's configuration
* [deleteStreamingProfile](docs/sdks/streamingprofiles/README.md#deletestreamingprofile) - Delete custom streaming profile or revert built-in profile to the original settings

### [transformations](docs/sdks/transformations/README.md)

* [listTransformations](docs/sdks/transformations/README.md#listtransformations) - Lists all transformation definitions in your account (including named transformations
* [getTransformation](docs/sdks/transformations/README.md#gettransformation) - Retrieves details of a specific transformation
* [createTransformation](docs/sdks/transformations/README.md#createtransformation) - Creates a new named transformation (assigning a custom name to a set of transformation
* [updateTransformation](docs/sdks/transformations/README.md#updatetransformation) - Updates the definition of an existing named transformation
* [deleteTransformation](docs/sdks/transformations/README.md#deletetransformation) - Deletes a named transformation from your account

### [triggers](docs/sdks/triggers/README.md)

* [listTrigger](docs/sdks/triggers/README.md#listtrigger) - Lists all webhook notification triggers configured for your product environmentcloudinary
* [createTrigger](docs/sdks/triggers/README.md#createtrigger) - Creates a new notification trigger (webhook) by specifying an event type and a destination
* [updateTrigger](docs/sdks/triggers/README.md#updatetrigger) - Updates the callback URL of an existing webhook trigger in your Cloudinary account
* [deleteTrigger](docs/sdks/triggers/README.md#deletetrigger) - Deletes a notification trigger

### [uploadMappings](docs/sdks/uploadmappings/README.md)

* [listUploadMappings](docs/sdks/uploadmappings/README.md#listuploadmappings) - Retrieves a list of all upload mapping rules configured in your Cloudinary product environment
* [createUploadMapping](docs/sdks/uploadmappings/README.md#createuploadmapping) - Creates a new upload mapping
* [updateUploadMapping](docs/sdks/uploadmappings/README.md#updateuploadmapping) - Updates an existing upload mapping by changing its remote URL template for a given
* [deleteUploadMapping](docs/sdks/uploadmappings/README.md#deleteuploadmapping) - Deletes a folder upload mapping
* [replaceUploadMappings](docs/sdks/uploadmappings/README.md#replaceuploadmappings) - Replaces all upload mappings

### [uploadPresets](docs/sdks/uploadpresets/README.md)

* [createUploadPreset](docs/sdks/uploadpresets/README.md#createuploadpreset) - Creates a new upload preset with specified configuration settings
* [listUploadPresets](docs/sdks/uploadpresets/README.md#listuploadpresets) - Lists all upload presets configured in the account
* [getUploadPreset](docs/sdks/uploadpresets/README.md#getuploadpreset) - Retrieves details of a single upload preset
* [updateUploadPreset](docs/sdks/uploadpresets/README.md#updateuploadpreset) - Updates an existing upload preset's configuration settings
* [deleteUploadPreset](docs/sdks/uploadpresets/README.md#deleteuploadpreset) - Deletes an upload preset from the account

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

- [`streamingProfilesCreateStreamingProfile`](docs/sdks/streamingprofiles/README.md#createstreamingprofile) - Creates a new adaptive streaming profile in your Cloudinary account
- [`streamingProfilesDeleteStreamingProfile`](docs/sdks/streamingprofiles/README.md#deletestreamingprofile) - Delete custom streaming profile or revert built-in profile to the original settings
- [`streamingProfilesGetStreamingProfile`](docs/sdks/streamingprofiles/README.md#getstreamingprofile) - Retrieves the details of a single adaptive streaming profile by its name
- [`streamingProfilesGetStreamingProfiles`](docs/sdks/streamingprofiles/README.md#getstreamingprofiles) - Lists all adaptive streaming profiles (both built-in and custom) defined in your Cloudinary account
- [`streamingProfilesUpdateStreamingProfile`](docs/sdks/streamingprofiles/README.md#updatestreamingprofile) - Modifies an existing adaptive streaming profile's configuration
- [`transformationsCreateTransformation`](docs/sdks/transformations/README.md#createtransformation) - Creates a new named transformation (assigning a custom name to a set of transformation
- [`transformationsDeleteTransformation`](docs/sdks/transformations/README.md#deletetransformation) - Deletes a named transformation from your account
- [`transformationsGetTransformation`](docs/sdks/transformations/README.md#gettransformation) - Retrieves details of a specific transformation
- [`transformationsListTransformations`](docs/sdks/transformations/README.md#listtransformations) - Lists all transformation definitions in your account (including named transformations
- [`transformationsUpdateTransformation`](docs/sdks/transformations/README.md#updatetransformation) - Updates the definition of an existing named transformation
- [`triggersCreateTrigger`](docs/sdks/triggers/README.md#createtrigger) - Creates a new notification trigger (webhook) by specifying an event type and a destination
- [`triggersDeleteTrigger`](docs/sdks/triggers/README.md#deletetrigger) - Deletes a notification trigger
- [`triggersListTrigger`](docs/sdks/triggers/README.md#listtrigger) - Lists all webhook notification triggers configured for your product environmentcloudinary
- [`triggersUpdateTrigger`](docs/sdks/triggers/README.md#updatetrigger) - Updates the callback URL of an existing webhook trigger in your Cloudinary account
- [`uploadMappingsCreateUploadMapping`](docs/sdks/uploadmappings/README.md#createuploadmapping) - Creates a new upload mapping
- [`uploadMappingsDeleteUploadMapping`](docs/sdks/uploadmappings/README.md#deleteuploadmapping) - Deletes a folder upload mapping
- [`uploadMappingsListUploadMappings`](docs/sdks/uploadmappings/README.md#listuploadmappings) - Retrieves a list of all upload mapping rules configured in your Cloudinary product environment
- [`uploadMappingsReplaceUploadMappings`](docs/sdks/uploadmappings/README.md#replaceuploadmappings) - Replaces all upload mappings
- [`uploadMappingsUpdateUploadMapping`](docs/sdks/uploadmappings/README.md#updateuploadmapping) - Updates an existing upload mapping by changing its remote URL template for a given
- [`uploadPresetsCreateUploadPreset`](docs/sdks/uploadpresets/README.md#createuploadpreset) - Creates a new upload preset with specified configuration settings
- [`uploadPresetsDeleteUploadPreset`](docs/sdks/uploadpresets/README.md#deleteuploadpreset) - Deletes an upload preset from the account
- [`uploadPresetsGetUploadPreset`](docs/sdks/uploadpresets/README.md#getuploadpreset) - Retrieves details of a single upload preset
- [`uploadPresetsListUploadPresets`](docs/sdks/uploadpresets/README.md#listuploadpresets) - Lists all upload presets configured in the account
- [`uploadPresetsUpdateUploadPreset`](docs/sdks/uploadpresets/README.md#updateuploadpreset) - Updates an existing upload preset's configuration settings

</details>
<!-- End Standalone functions [standalone-funcs] -->

<!-- Start Retries [retries] -->
## Retries

Some of the endpoints in this SDK support retries.  If you use the SDK without any configuration, it will fall back to the default retry strategy provided by the API.  However, the default retry strategy can be overridden on a per-operation basis, or across the entire SDK.

To change the default retry strategy for a single API call, simply provide a retryConfig object to the call:
```typescript
import { CloudinaryEnvConfig } from "@cloudinary/environment-config";

const cloudinaryEnvConfig = new CloudinaryEnvConfig({
  cloudName: "<value>",
  security: {
    cloudinaryAuth: {
      apiKey: "CLOUDINARY_API_KEY",
      apiSecret: "CLOUDINARY_API_SECRET",
    },
  },
});

async function run() {
  const result = await cloudinaryEnvConfig.transformations.listTransformations(
    20,
    "8edbc61040178db60b0973ca9494bf3a",
    {
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
    },
  );

  console.log(result);
}

run();

```

If you'd like to override the default retry strategy for all operations that support retries, you can provide a retryConfig at SDK initialization:
```typescript
import { CloudinaryEnvConfig } from "@cloudinary/environment-config";

const cloudinaryEnvConfig = new CloudinaryEnvConfig({
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
  cloudName: "<value>",
  security: {
    cloudinaryAuth: {
      apiKey: "CLOUDINARY_API_KEY",
      apiSecret: "CLOUDINARY_API_SECRET",
    },
  },
});

async function run() {
  const result = await cloudinaryEnvConfig.transformations.listTransformations(
    20,
    "8edbc61040178db60b0973ca9494bf3a",
  );

  console.log(result);
}

run();

```
<!-- End Retries [retries] -->

<!-- Start Error Handling [errors] -->
## Error Handling

[`CloudinaryEnvConfigError`](./src/models/errors/cloudinaryenvconfigerror.ts) is the base class for all HTTP error responses. It has the following properties:

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
import { CloudinaryEnvConfig } from "@cloudinary/environment-config";
import * as errors from "@cloudinary/environment-config/models/errors";

const cloudinaryEnvConfig = new CloudinaryEnvConfig({
  cloudName: "<value>",
  security: {
    cloudinaryAuth: {
      apiKey: "CLOUDINARY_API_KEY",
      apiSecret: "CLOUDINARY_API_SECRET",
    },
  },
});

async function run() {
  try {
    const result = await cloudinaryEnvConfig.transformations
      .listTransformations(20, "8edbc61040178db60b0973ca9494bf3a");

    console.log(result);
  } catch (error) {
    // The base class for HTTP error responses
    if (error instanceof errors.CloudinaryEnvConfigError) {
      console.log(error.message);
      console.log(error.statusCode);
      console.log(error.body);
      console.log(error.headers);

      // Depending on the method different errors may be thrown
      if (error instanceof errors.ApiError) {
        console.log(error.data$.error); // components.ErrorT
      }
    }
  }
}

run();

```

### Error Classes
**Primary errors:**
* [`CloudinaryEnvConfigError`](./src/models/errors/cloudinaryenvconfigerror.ts): The base class for HTTP error responses.
  * [`ApiError`](docs/models/errors/apierror.md): Generic error.

<details><summary>Less common errors (6)</summary>

<br />

**Network errors:**
* [`ConnectionError`](./src/models/errors/httpclienterrors.ts): HTTP client was unable to make a request to a server.
* [`RequestTimeoutError`](./src/models/errors/httpclienterrors.ts): HTTP request timed out due to an AbortSignal signal.
* [`RequestAbortedError`](./src/models/errors/httpclienterrors.ts): HTTP request was aborted by the client.
* [`InvalidRequestError`](./src/models/errors/httpclienterrors.ts): Any input used to create a request is invalid.
* [`UnexpectedClientError`](./src/models/errors/httpclienterrors.ts): Unrecognised or unexpected error.


**Inherit from [`CloudinaryEnvConfigError`](./src/models/errors/cloudinaryenvconfigerror.ts)**:
* [`ResponseValidationError`](./src/models/errors/responsevalidationerror.ts): Type mismatch between the data returned from the server and the structure expected by the SDK. See `error.rawValue` for the raw value and `error.pretty()` for a nicely formatted multi-line string.

</details>
<!-- End Error Handling [errors] -->

<!-- Start Server Selection [server] -->
## Server Selection

### Select Server by Index

You can override the default server globally by passing a server index to the `serverIdx: number` optional parameter when initializing the SDK client instance. The selected server will then be used as the default on the operations that use it. This table lists the indexes associated with the available servers:

| #   | Server                            | Variables | Description                                     |
| --- | --------------------------------- | --------- | ----------------------------------------------- |
| 0   | `https://{region}.cloudinary.com` | `region`  | Regional API endpoints for optimal performance. |
| 1   | `https://{host}`                  | `host`    | Custom domains for enterprise deployments.      |

If the selected server has variables, you may override its default values through the additional parameters made available in the SDK constructor:

| Variable | Parameter                     | Supported Values                            | Default                | Description                 |
| -------- | ----------------------------- | ------------------------------------------- | ---------------------- | --------------------------- |
| `region` | `region: models.ServerRegion` | - `"api"`<br/>- `"api-eu"`<br/>- `"api-ap"` | `"api"`                | Regional endpoint selection |
| `host`   | `host: string`                | string                                      | `"api.cloudinary.com"` | API host domain.            |

#### Example

```typescript
import { CloudinaryEnvConfig } from "@cloudinary/environment-config";

const cloudinaryEnvConfig = new CloudinaryEnvConfig({
  serverIdx: 1,
  host: "unlined-aircraft.info",
  cloudName: "<value>",
  security: {
    cloudinaryAuth: {
      apiKey: "CLOUDINARY_API_KEY",
      apiSecret: "CLOUDINARY_API_SECRET",
    },
  },
});

async function run() {
  const result = await cloudinaryEnvConfig.transformations.listTransformations(
    20,
    "8edbc61040178db60b0973ca9494bf3a",
  );

  console.log(result);
}

run();

```

### Override Server URL Per-Client

The default server can also be overridden globally by passing a URL to the `serverURL: string` optional parameter when initializing the SDK client instance. For example:
```typescript
import { CloudinaryEnvConfig } from "@cloudinary/environment-config";

const cloudinaryEnvConfig = new CloudinaryEnvConfig({
  serverURL: "https://api.cloudinary.com",
  cloudName: "<value>",
  security: {
    cloudinaryAuth: {
      apiKey: "CLOUDINARY_API_KEY",
      apiSecret: "CLOUDINARY_API_SECRET",
    },
  },
});

async function run() {
  const result = await cloudinaryEnvConfig.transformations.listTransformations(
    20,
    "8edbc61040178db60b0973ca9494bf3a",
  );

  console.log(result);
}

run();

```
<!-- End Server Selection [server] -->

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
import { CloudinaryEnvConfig } from "@cloudinary/environment-config";
import { HTTPClient } from "@cloudinary/environment-config/lib/http";

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

const sdk = new CloudinaryEnvConfig({ httpClient });
```
<!-- End Custom HTTP Client [http-client] -->

<!-- Start Debugging [debug] -->
## Debugging

You can setup your SDK to emit debug logs for SDK requests and responses.

You can pass a logger that matches `console`'s interface as an SDK option.

> [!WARNING]
> Beware that debug logging will reveal secrets, like API tokens in headers, in log messages printed to a console or files. It's recommended to use this feature only during local development and not in production.

```typescript
import { CloudinaryEnvConfig } from "@cloudinary/environment-config";

const sdk = new CloudinaryEnvConfig({ debugLogger: console });
```

You can also enable a default debug logger by setting an environment variable `CLOUDINARY_DEBUG` to true.
<!-- End Debugging [debug] -->

<!-- Placeholder for Future Speakeasy SDK Sections -->
