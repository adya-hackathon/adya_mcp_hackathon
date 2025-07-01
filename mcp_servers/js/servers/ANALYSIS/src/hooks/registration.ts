import { Hooks } from "./types.js";
import { CloudinaryHook } from "./cloudinaryHook.js";
import { UserAgentHook } from "./userAgentHook.js";

/*
 * This file is only ever generated once on the first generation and then is free to be modified.
 * Any hooks you wish to add should be registered in the initHooks function. Feel free to define them
 * in this file or in separate files in the hooks folder.
 */

export function initHooks(hooks: Hooks) {
    const cldHook = new CloudinaryHook();
    hooks.registerBeforeRequestHook(cldHook);

    const userAgentHook = new UserAgentHook();
    hooks.registerSDKInitHook(userAgentHook);
}
