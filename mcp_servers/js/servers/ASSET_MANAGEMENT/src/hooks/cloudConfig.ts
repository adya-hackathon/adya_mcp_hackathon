declare const process: any;

export class CloudConfig {
    cloudName: string;
    apiKey: string;
    apiSecret: string;

    constructor() {
        this.cloudName = "";
        this.apiKey = "";
        this.apiSecret = "";
    }
}
