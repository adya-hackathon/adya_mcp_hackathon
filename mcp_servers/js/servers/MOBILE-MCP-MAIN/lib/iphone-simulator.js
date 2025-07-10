"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimctlManager = exports.Simctl = void 0;
const node_child_process_1 = require("node:child_process");
const logger_1 = require("./logger");
const webdriver_agent_1 = require("./webdriver-agent");
const robot_1 = require("./robot");
const TIMEOUT = 30000;
const WDA_PORT = 8100;
const MAX_BUFFER_SIZE = 1024 * 1024 * 4;
class Simctl {
    simulatorUuid;
    constructor(simulatorUuid) {
        this.simulatorUuid = simulatorUuid;
    }
    async isWdaInstalled() {
        const apps = await this.listApps();
        return apps.map(app => app.packageName).includes("com.facebook.WebDriverAgentRunner.xctrunner");
    }
    async startWda() {
        if (!(await this.isWdaInstalled())) {
            // wda is not even installed, won't attempt to start it
            return;
        }
        (0, logger_1.trace)("Starting WebDriverAgent");
        const webdriverPackageName = "com.facebook.WebDriverAgentRunner.xctrunner";
        this.simctl("launch", this.simulatorUuid, webdriverPackageName);
        // now we wait for wda to have a successful status
        const wda = new webdriver_agent_1.WebDriverAgent("localhost", WDA_PORT);
        // wait up to 10 seconds for wda to start
        const timeout = +new Date() + 10 * 1000;
        while (+new Date() < timeout) {
            // cross fingers and see if wda is already running
            if (await wda.isRunning()) {
                (0, logger_1.trace)("WebDriverAgent is now running");
                return;
            }
            // wait 100ms before trying again
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        (0, logger_1.trace)("Could not start WebDriverAgent in time, giving up");
    }
    async wda() {
        const wda = new webdriver_agent_1.WebDriverAgent("localhost", WDA_PORT);
        if (!(await wda.isRunning())) {
            await this.startWda();
            if (!(await wda.isRunning())) {
                throw new robot_1.ActionableError("WebDriverAgent is not running on simulator, please see https://github.com/mobile-next/mobile-mcp/wiki/");
            }
            // was successfully started
        }
        return wda;
    }
    simctl(...args) {
        return (0, node_child_process_1.execFileSync)("xcrun", ["simctl", ...args], {
            timeout: TIMEOUT,
            maxBuffer: MAX_BUFFER_SIZE,
        });
    }
    async getScreenshot() {
        const wda = await this.wda();
        return await wda.getScreenshot();
        // alternative: return this.simctl("io", this.simulatorUuid, "screenshot", "-");
    }
    async openUrl(url) {
        const wda = await this.wda();
        await wda.openUrl(url);
        // alternative: this.simctl("openurl", this.simulatorUuid, url);
    }
    async launchApp(packageName) {
        this.simctl("launch", this.simulatorUuid, packageName);
    }
    async terminateApp(packageName) {
        this.simctl("terminate", this.simulatorUuid, packageName);
    }
    async listApps() {
        const text = this.simctl("listapps", this.simulatorUuid).toString();
        const result = (0, node_child_process_1.execFileSync)("plutil", ["-convert", "json", "-o", "-", "-r", "-"], {
            input: text,
        });
        const output = JSON.parse(result.toString());
        return Object.values(output).map(app => ({
            packageName: app.CFBundleIdentifier,
            appName: app.CFBundleDisplayName,
        }));
    }
    async getScreenSize() {
        const wda = await this.wda();
        return wda.getScreenSize();
    }
    async sendKeys(keys) {
        const wda = await this.wda();
        return wda.sendKeys(keys);
    }
    async swipe(direction) {
        const wda = await this.wda();
        return wda.swipe(direction);
    }
    async swipeFromCoordinate(x, y, direction, distance) {
        const wda = await this.wda();
        return wda.swipeFromCoordinate(x, y, direction, distance);
    }
    async tap(x, y) {
        const wda = await this.wda();
        return wda.tap(x, y);
    }
    async pressButton(button) {
        const wda = await this.wda();
        return wda.pressButton(button);
    }
    async getElementsOnScreen() {
        const wda = await this.wda();
        return wda.getElementsOnScreen();
    }
    async setOrientation(orientation) {
        const wda = await this.wda();
        return wda.setOrientation(orientation);
    }
    async getOrientation() {
        const wda = await this.wda();
        return wda.getOrientation();
    }
}
exports.Simctl = Simctl;
class SimctlManager {
    listSimulators() {
        // detect if this is a mac
        if (process.platform !== "darwin") {
            // don't even try to run xcrun
            return [];
        }
        try {
            const text = (0, node_child_process_1.execFileSync)("xcrun", ["simctl", "list", "devices", "-j"]).toString();
            const json = JSON.parse(text);
            return Object.values(json.devices).flatMap(device => {
                return device.map(d => {
                    return {
                        name: d.name,
                        uuid: d.udid,
                        state: d.state,
                    };
                });
            });
        }
        catch (error) {
            console.error("Error listing simulators", error);
            return [];
        }
    }
    listBootedSimulators() {
        return this.listSimulators()
            .filter(simulator => simulator.state === "Booted");
    }
    getSimulator(uuid) {
        return new Simctl(uuid);
    }
}
exports.SimctlManager = SimctlManager;
