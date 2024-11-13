let video;
let capturedImage;
let redChannelImage, greenChannelImage, blueChannelImage;
let hsvImage, labImage, thresholdedHSV, thresholdedLAB;
let isGreyCaptured = false;
let isRGBCaptured = false;
let isConverted = false;

// Sliders
let hueSlider, satSlider, valSlider, lSlider, aSlider, bSlider;

// Frame rate throttling
let frameCounter = 0;
let frameThrottle = 5;  // Process every 5 frames

function setup() {
    createCanvas(960, 720);
    background(200);

    video = createCapture(VIDEO);
    video.size(640, 480);
    video.hide();

    fill(0);
    textSize(16);
    text("Press any key to capture and process the image into RGB channels", 10, height - 20);

    hueSlider = createSlider(0, 255, 128);
    satSlider = createSlider(0, 255, 128);
    valSlider = createSlider(0, 255, 128);

    hueSlider.position(10, height + 10);
    satSlider.position(10, height + 40);
    valSlider.position(10, height + 70);

    lSlider = createSlider(0, 100, 50);
    aSlider = createSlider(-128, 127, 0);
    bSlider = createSlider(-128, 127, 0);

    lSlider.position(200, height + 10);
    aSlider.position(200, height + 40);
    bSlider.position(200, height + 70);

    hueSlider.input(debouncedProcessing);
    satSlider.input(debouncedProcessing);
    valSlider.input(debouncedProcessing);
    lSlider.input(debouncedProcessing);
    aSlider.input(debouncedProcessing);
    bSlider.input(debouncedProcessing);
}

function draw() {
    image(video, 0, 0, 640, 480);

    if (isRGBCaptured) {
        image(redChannelImage, 0, 480, 160, 120);
        image(greenChannelImage, 160, 480, 160, 120);
        image(blueChannelImage, 320, 480, 160, 120);
    }

    if (isGreyCaptured) {
        image(capturedImage, 640, 0, 160, 120);
        image(processedImage, 800, 0, 160, 120);
    }

    if (isConverted) {
        image(hsvImage, 640, 120, 160, 120);
        image(labImage, 800, 120, 160, 120);
        image(thresholdedHSV, 640, 240, 160, 120);
        image(thresholdedLAB, 800, 240, 160, 120);

        fill(255);
        text(`HSV Thresholds: H=${hueSlider.value()} S=${satSlider.value()} V=${valSlider.value()}`, 10, height + 100);
        text(`LAB Thresholds: L=${lSlider.value()} A=${aSlider.value()} B=${bSlider.value()}`, 10, height + 130);
    }

    // Frame rate throttling for processing
    if (frameCounter % frameThrottle === 0) {
        debouncedProcessing();
    }
    frameCounter++;
}

function keyPressed() {
    grayScaled();
    RGBChannelSplitting();
    debouncedProcessing();
}

function RGBChannelSplitting() {
    capturedImage = video.get();
    capturedImage.resize(320, 240);  // Reduce the resolution for faster processing
    redChannelImage = createImage(capturedImage.width, capturedImage.height);
    greenChannelImage = createImage(capturedImage.width, capturedImage.height);
    blueChannelImage = createImage(capturedImage.width, capturedImage.height);
    capturedImage.loadPixels();
    redChannelImage.loadPixels();
    greenChannelImage.loadPixels();
    blueChannelImage.loadPixels();

    for (let i = 0; i < capturedImage.pixels.length; i += 4) {
        let r = capturedImage.pixels[i];
        let g = capturedImage.pixels[i + 1];
        let b = capturedImage.pixels[i + 2];

        redChannelImage.pixels[i] = r;
        redChannelImage.pixels[i + 1] = 0;
        redChannelImage.pixels[i + 2] = 0;
        redChannelImage.pixels[i + 3] = 255;

        greenChannelImage.pixels[i] = 0;
        greenChannelImage.pixels[i + 1] = g;
        greenChannelImage.pixels[i + 2] = 0;
        greenChannelImage.pixels[i + 3] = 255;

        blueChannelImage.pixels[i] = 0;
        blueChannelImage.pixels[i + 1] = 0;
        blueChannelImage.pixels[i + 2] = b;
        blueChannelImage.pixels[i + 3] = 255;
    }

    redChannelImage.updatePixels();
    greenChannelImage.updatePixels();
    blueChannelImage.updatePixels();
    isRGBCaptured = true;
}

function grayScaled() {
    capturedImage = video.get();
    capturedImage.resize(320, 240);  // Reduce the resolution for faster processing
    processedImage = createImage(capturedImage.width, capturedImage.height);
    processedImage.copy(capturedImage, 0, 0, capturedImage.width, capturedImage.height, 0, 0, capturedImage.width, capturedImage.height);
    processedImage.loadPixels();

    for (let i = 0; i < processedImage.pixels.length; i += 4) {
        let r = processedImage.pixels[i];
        let g = processedImage.pixels[i + 1];
        let b = processedImage.pixels[i + 2];
        let gray = (r + g + b) / 3;
        gray = min(gray + gray * 0.2, 255);
        processedImage.pixels[i] = gray;
        processedImage.pixels[i + 1] = gray;
        processedImage.pixels[i + 2] = gray;
    }

    processedImage.updatePixels();
    isGreyCaptured = true;
}

function colorSpaceConversionAndThresholding() {
    console.log("Applying thresholds...");
    let img = video.get();
    img.resize(320, 240);  // Reduce the resolution for faster processing

    hsvImage = createImage(img.width, img.height);
    thresholdedHSV = createImage(img.width, img.height);
    img.loadPixels();
    hsvImage.loadPixels();
    thresholdedHSV.loadPixels();

    for (let i = 0; i < img.pixels.length; i += 4) {
        let r = img.pixels[i];
        let g = img.pixels[i + 1];
        let b = img.pixels[i + 2];

        let hsv = rgbToHsv(r, g, b);

        hsvImage.pixels[i] = hsv[0];
        hsvImage.pixels[i + 1] = hsv[1];
        hsvImage.pixels[i + 2] = hsv[2];
        hsvImage.pixels[i + 3] = 255;

        let hueThreshold = hueSlider.value();
        let satThreshold = satSlider.value();
        let valThreshold = valSlider.value();

        if (hsv[0] > hueThreshold && hsv[1] > satThreshold && hsv[2] > valThreshold) {
            thresholdedHSV.pixels[i] = 255;
            thresholdedHSV.pixels[i + 1] = 255;
            thresholdedHSV.pixels[i + 2] = 255;
        } else {
            thresholdedHSV.pixels[i] = 0;
            thresholdedHSV.pixels[i + 1] = 0;
            thresholdedHSV.pixels[i + 2] = 0;
        }

        thresholdedHSV.pixels[i + 3] = 255;
    }

    labImage = createImage(img.width, img.height);
    thresholdedLAB = createImage(img.width, img.height);
    img.loadPixels();
    labImage.loadPixels();
    thresholdedLAB.loadPixels();

    for (let i = 0; i < img.pixels.length; i += 4) {
        let r = img.pixels[i];
        let g = img.pixels[i + 1];
        let b = img.pixels[i + 2];

        let lab = rgbToLab(r, g, b);

        labImage.pixels[i] = lab[0];
        labImage.pixels[i + 1] = lab[1];
        labImage.pixels[i + 2] = lab[2];
        labImage.pixels[i + 3] = 255;

        let lThreshold = lSlider.value();
        let aThreshold = aSlider.value();
        let bThreshold = bSlider.value();

        if (lab[0] > lThreshold && lab[1] > aThreshold && lab[2] > bThreshold) {
            thresholdedLAB.pixels[i] = 255;
            thresholdedLAB.pixels[i + 1] = 255;
            thresholdedLAB.pixels[i + 2] = 255;
        } else {
            thresholdedLAB.pixels[i] = 0;
            thresholdedLAB.pixels[i + 1] = 0;
            thresholdedLAB.pixels[i + 2] = 0;
        }

        thresholdedLAB.pixels[i + 3] = 255;
    }

    hsvImage.updatePixels();
    thresholdedHSV.updatePixels();
    labImage.updatePixels();
    thresholdedLAB.updatePixels();

    isConverted = true;
}

// Helper function to debounce processing
function debouncedProcessing() {
    clearTimeout(this.timer);
    this.timer = setTimeout(colorSpaceConversionAndThresholding, 100);
}

// Helper function to convert RGB to HSV
function rgbToHsv(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    let max = Math.max(r, g, b),
        min = Math.min(r, g, b);
    let h, s, v = max;

    let d = max - min;
    s = max == 0 ? 0 : d / max;

    if (max == min) {
        h = 0;
    } else {
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }
        h /= 6;
    }

    return [h * 255, s * 255, v * 255];
}

// Helper function to convert RGB to LAB
function rgbToLab(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;

    r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
    g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
    b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;

    let x = r * 0.4124 + g * 0.3576 + b * 0.1805;
    let y = r * 0.2126 + g * 0.7152 + b * 0.0722;
    let z = r * 0.0193 + g * 0.1192 + b * 0.9505;

    x /= 0.95047;
    y /= 1.0;
    z /= 1.08883;

    x = x > 0.008856 ? Math.pow(x, 1 / 3) : (7.787 * x) + (16 / 116);
    y = y > 0.008856 ? Math.pow(y, 1 / 3) : (7.787 * y) + (16 / 116);
    z = z > 0.008856 ? Math.pow(z, 1 / 3) : (7.787 * z) + (16 / 116);

    let l = (116 * y) - 16;
    let a = 500 * (x - y);
    let c = 200 * (y - z);

    return [l, a, c];
}
