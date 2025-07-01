import {CloudConfig} from "./cloudConfig.js";
import {BeforeRequestHook, BeforeRequestContext} from "./types.js";

export class CloudinaryHook implements BeforeRequestHook {
    private readonly config: CloudConfig;

    constructor() {
        this.config = new CloudConfig();
    }

    beforeRequest(hookCtx: BeforeRequestContext, request: Request): Request {
        const {cloudName} = this.config;
        let {apiKey, apiSecret} = this.config;

        // Optionally merge user-supplied security overrides
        const securityVal = hookCtx.securitySource ? hookCtx.securitySource : null;
        if (securityVal && securityVal.cloudinaryAuth) {
            if (securityVal.cloudinaryAuth.apiKey) {
                apiKey = securityVal.cloudinaryAuth.apiKey;
            }
            if (securityVal.cloudinaryAuth.apiSecret) {
                apiSecret = securityVal.cloudinaryAuth.apiSecret;
            }
        }

        if (cloudName && request.url.includes("/CLOUD_NAME/")) {
            const newUrl = request.url.replace("/CLOUD_NAME/", `/${cloudName}/`);
            request = new Request(newUrl, request);
        }

        // If we have credentials, set Basic Auth
        if (apiKey && apiSecret) {
            const authValue = btoa(`${apiKey}:${apiSecret}`);
            request.headers.set("Authorization", `Basic ${authValue}`);
        }

        return request;
    }
}
