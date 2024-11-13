let video;
let capturedImage;
let redChannelImage, greenChannelImage, blueChannelImage;
let hsvImage, labImage, thresholdedHSV, thresholdedLAB;
let isGreyCaptured = false;
let isRGBCaptured = false;
let isConverted = false;

// Sliders
let hueSlider, satSlider, valSlider, lSlider, aSlider, bSlider;

function setup() {
    // Create a canvas with additional space for the new images
    createCanvas(960, 720); // Adjusted height and width to accommodate extra images
    background(200);

    // Start capturing video from the webcam
    video = createCapture(VIDEO);
    video.size(640, 480);
    video.hide(); // Hide the original video feed

    // Add instructions
    fill(0);
    textSize(16);
    text("Press any key to capture and process the image into RGB channels", 10, height - 20);

    // Create sliders for HSV thresholding
    hueSlider = createSlider(0, 255, 128);
    satSlider = createSlider(0, 255, 128);
    valSlider = createSlider(0, 255, 128);

    // Create sliders for LAB thresholding
    lSlider = createSlider(0, 100, 50);
    aSlider = createSlider(-128, 127, 0);
    bSlider = createSlider(-128, 127, 0);
}

function draw() {
    // Draw the video feed on the canvas
    image(video, 0, 0, 640, 480);

    // Display the RGB channels
    if (isRGBCaptured) {
        image(redChannelImage, 0, 480, 160, 120);
        image(greenChannelImage, 160, 480, 160, 120);
        image(blueChannelImage, 320, 480, 160, 120);
    }

    // Display grayscale image and processed images
    if (isGreyCaptured) {
        image(capturedImage, 640, 0, 160, 120);
        image(processedImage, 800, 0, 160, 120);
    }

    // Display the color space converted images
    if (isConverted) {
        // HSV and LAB images
        image(hsvImage, 640, 120, 160, 120);
        image(labImage, 800, 120, 160, 120);

        // Thresholded HSV and LAB images
        image(thresholdedHSV, 640, 240, 160, 120);
        image(thresholdedLAB, 800, 240, 160, 120);
    }
}

// Capture and process image on key press
function keyPressed() {
    grayScaled();
    RGBChannelSplitting();
    colorSpaceConversionAndThresholding();
}

// Function for RGB Channel Splitting
function RGBChannelSplitting() {
    capturedImage = video.get();
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

// Function for Grayscale Conversion
function grayScaled() {
    capturedImage = video.get();
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

// Function for Color Space Conversion and Thresholding
function colorSpaceConversionAndThresholding() {
    // Get the current frame from the video
    let img = video.get();

    // Convert to HSV
    hsvImage = createImage(img.width, img.height);
    thresholdedHSV = createImage(img.width, img.height);
    img.loadPixels();
    hsvImage.loadPixels();
    thresholdedHSV.loadPixels();

    for (let i = 0; i < img.pixels.length; i += 4) {
        let r = img.pixels[i];
        let g = img.pixels[i + 1];
        let b = img.pixels[i + 2];

        // Convert to HSV (manual conversion)
        let hsv = rgbToHsv(r, g, b);

        // Set HSV image
        hsvImage.pixels[i] = hsv[0];
        hsvImage.pixels[i + 1] = hsv[1];
        hsvImage.pixels[i + 2] = hsv[2];
        hsvImage.pixels[i + 3] = 255;

        // Apply thresholding using slider values
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

    hsvImage.updatePixels();
    thresholdedHSV.updatePixels();

    // Convert to LAB (manual conversion)
    labImage = createImage(img.width, img.height);
    thresholdedLAB = createImage(img.width, img.height);
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

    labImage.updatePixels();
    thresholdedLAB.updatePixels();

    // Set the flag to true to indicate color space conversion and thresholding is done
    isConverted = true;
}

// Function to convert RGB to HSV (simplified)
function rgbToHsv(r, g, b) {
    // Normalized RGB values
    let rNorm = r / 255;
    let gNorm = g / 255;
    let bNorm = b / 255;

    let cMax = max(rNorm, gNorm, bNorm);
    let cMin = min(rNorm, gNorm, bNorm);
    let delta = cMax - cMin;

    let hue = 0;
    if (delta !== 0) {
        if (cMax === rNorm) {
            hue = 60 * (((gNorm - bNorm) / delta) % 6);
        } else if (cMax === gNorm) {
            hue = 60 * ((bNorm - rNorm) / delta + 2);
        } else {
            hue = 60 * ((rNorm - gNorm) / delta + 4);
        }
    }

    let saturation = cMax === 0 ? 0 : delta / cMax;
    let value = cMax;

    return [hue, saturation * 255, value * 255];
}

// Function to convert RGB to LAB (simplified)
function rgbToLab(r, g, b) {
    // Normalized RGB values
    let rNorm = r / 255;
    let gNorm = g / 255;
    let bNorm = b / 255;

    // Convert RGB to XYZ
    let x = rNorm * 0.4124 + gNorm * 0.3576 + bNorm * 0.1805;
    let y = rNorm * 0.2126 + gNorm * 0.7152 + bNorm * 0.0722;
    let z = rNorm * 0.0193 + gNorm * 0.1192 + bNorm * 0.9505;

    // Convert XYZ to LAB
    let l = (116 * f(y / 1.000)) - 16;
    let a = 500 * (f(x / 0.9505) - f(y / 1.000));
    let bLab = 200 * (f(y / 1.000) - f(z / 1.089));

    return [l, a, bLab];
}

// Helper function for LAB conversion
function f(t) {
    return t > 0.008856 ? pow(t, 1 / 3) : (7.787 * t) + (16 / 116);
}


/*

HSV and LAB Conversion:

Added functions rgbToHsv() and rgbToLab() to convert RGB values into HSV and LAB color spaces.
Created new images to display the converted color space images.
Implemented thresholding for the HSV and LAB images using sliders.
Display Layout:

Adjusted the canvas size and grid positions to ensure all the images fit on the canvas without overlapping with the webcam stream.
Thresholding:

Created sliders to control the thresholding for the HSV and LAB color space images, similar to the RGB channel thresholding.
 */