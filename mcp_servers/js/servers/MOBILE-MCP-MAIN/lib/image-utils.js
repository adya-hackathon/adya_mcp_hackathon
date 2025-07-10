"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isImageMagickInstalled = exports.Image = exports.ImageTransformer = void 0;
const child_process_1 = require("child_process");
const DEFAULT_JPEG_QUALITY = 75;
class ImageTransformer {
    buffer;
    newWidth = 0;
    newFormat = "png";
    jpegOptions = { quality: DEFAULT_JPEG_QUALITY };
    constructor(buffer) {
        this.buffer = buffer;
    }
    resize(width) {
        this.newWidth = width;
        return this;
    }
    jpeg(options) {
        this.newFormat = "jpg";
        this.jpegOptions = options;
        return this;
    }
    png() {
        this.newFormat = "png";
        return this;
    }
    toBuffer() {
        const proc = (0, child_process_1.spawnSync)("magick", ["-", "-resize", `${this.newWidth}x`, "-quality", `${this.jpegOptions.quality}`, `${this.newFormat}:-`], {
            maxBuffer: 8 * 1024 * 1024,
            input: this.buffer
        });
        return proc.stdout;
    }
}
exports.ImageTransformer = ImageTransformer;
class Image {
    buffer;
    constructor(buffer) {
        this.buffer = buffer;
    }
    static fromBuffer(buffer) {
        return new Image(buffer);
    }
    resize(width) {
        return new ImageTransformer(this.buffer).resize(width);
    }
    jpeg(options) {
        return new ImageTransformer(this.buffer).jpeg(options);
    }
}
exports.Image = Image;
const isImageMagickInstalled = () => {
    try {
        return (0, child_process_1.execFileSync)("magick", ["--version"])
            .toString()
            .split("\n")
            .filter(line => line.includes("Version: ImageMagick"))
            .length > 0;
    }
    catch (error) {
        return false;
    }
};
exports.isImageMagickInstalled = isImageMagickInstalled;
