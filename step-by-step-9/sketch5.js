let video;
let capturedImage;
let redChannelImage, greenChannelImage, blueChannelImage;
let processedImage;
let isGreyCaptured = false;
let isRGBCaptured = false;
let isThresholdingApplied = false;

let redSlider, greenSlider, blueSlider, brightnessSlider;

function setup() {
    // Create a canvas
    createCanvas(640, 480);
    background(200);

    // Start capturing video from the webcam
    video = createCapture(VIDEO);
    video.size(640, 480);
    video.hide(); // Hide the original video feed

    // Add instructions
    fill(0);
    textSize(16);
    text("Press any key to capture and process the image into RGB channels", 10, height - 20);

    // Create sliders for RGB thresholding
    redSlider = createSlider(0, 255, 127);
    redSlider.position(10, height + 20);
    redSlider.input(applyThresholding);  // Add event handling

    greenSlider = createSlider(0, 255, 127);
    greenSlider.position(160, height + 20);
    greenSlider.input(applyThresholding);  // Add event handling

    blueSlider = createSlider(0, 255, 127);
    blueSlider.position(310, height + 20);
    blueSlider.input(applyThresholding);  // Add event handling

    // Create brightness slider
    brightnessSlider = createSlider(0, 100, 20);
    brightnessSlider.position(460, height + 20);
    brightnessSlider.input(grayScaled);  // Add event handling
}

function draw() {
    // Draw the video feed on the canvas
    image(video, 0, 0, width, height);

    // If an image is captured, display the RGB channels
    if (isRGBCaptured) {
        // Display the red channel image
        image(redChannelImage, 0, 0, 160, 120);

        // Display the green channel image
        image(greenChannelImage, 160, 0, 160, 120);

        // Display the blue channel image
        image(blueChannelImage, 320, 0, 160, 120);
    }

    if (isGreyCaptured) {
        // Display the original captured image
        image(capturedImage, 160, 120, 160, 120);

        // Display the processed (grayscale and brightness adjusted) image
        image(processedImage, 320, 120, 160, 120);
    }

    if (isThresholdingApplied) {
        applyThresholding();
    }
}

// Capture and process image on key press
function keyPressed() {
    grayScaled();
    RGBChannelSplitting();
    setupThresholding();
}

// Function to handle RGB channel splitting
function RGBChannelSplitting() {
    capturedImage = video.get();

    // Create copies for each color channel
    redChannelImage = createImage(capturedImage.width, capturedImage.height);
    greenChannelImage = createImage(capturedImage.width, capturedImage.height);
    blueChannelImage = createImage(capturedImage.width, capturedImage.height);

    // Load pixel data for processing
    capturedImage.loadPixels();
    redChannelImage.loadPixels();
    greenChannelImage.loadPixels();
    blueChannelImage.loadPixels();

    // Loop through each pixel and extract the RGB channels
    for (let i = 0; i < capturedImage.pixels.length; i += 4) {
        let r = capturedImage.pixels[i];
        let g = capturedImage.pixels[i + 1];
        let b = capturedImage.pixels[i + 2];

        // Red channel: keep red value, set green and blue to 0
        redChannelImage.pixels[i] = r;
        redChannelImage.pixels[i + 1] = 0;
        redChannelImage.pixels[i + 2] = 0;
        redChannelImage.pixels[i + 3] = 255; // Alpha channel

        // Green channel: keep green value, set red and blue to 0
        greenChannelImage.pixels[i] = 0;
        greenChannelImage.pixels[i + 1] = g;
        greenChannelImage.pixels[i + 2] = 0;
        greenChannelImage.pixels[i + 3] = 255; // Alpha channel

        // Blue channel: keep blue value, set red and green to 0
        blueChannelImage.pixels[i] = 0;
        blueChannelImage.pixels[i + 1] = 0;
        blueChannelImage.pixels[i + 2] = b;
        blueChannelImage.pixels[i + 3] = 255; // Alpha channel
    }

    // Update pixels
    redChannelImage.updatePixels();
    greenChannelImage.updatePixels();
    blueChannelImage.updatePixels();

    // Set the flag to true to indicate an image is captured and processed
    isRGBCaptured = true;
}

// Function to handle grayscale conversion with brightness adjustment
function grayScaled() {
    capturedImage = video.get();

    // Create a copy of the captured image for processing
    processedImage = createImage(capturedImage.width, capturedImage.height);
    processedImage.copy(capturedImage, 0, 0, capturedImage.width, capturedImage.height, 0, 0, capturedImage.width, capturedImage.height);

    // Process the image: Convert to grayscale and adjust brightness
    processedImage.loadPixels();
    let brightness = brightnessSlider.value();
    for (let i = 0; i < processedImage.pixels.length; i += 4) {
        let r = processedImage.pixels[i];
        let g = processedImage.pixels[i + 1];
        let b = processedImage.pixels[i + 2];

        // Convert to grayscale by averaging the RGB values
        let gray = (r + g + b) / 3;

        // Adjust brightness based on slider value
        gray = min(gray + gray * brightness / 100, 255);

        // Set the new grayscale value back to the pixel array
        processedImage.pixels[i] = gray;
        processedImage.pixels[i + 1] = gray;
        processedImage.pixels[i + 2] = gray;
    }
    processedImage.updatePixels();

    // Set the flag to true to indicate an image is captured and processed
    isGreyCaptured = true;
}

// Function to handle RGB thresholding
function setupThresholding() {
    capturedImage = video.get();

    redChannelImage = createImage(capturedImage.width, capturedImage.height);
    greenChannelImage = createImage(capturedImage.width, capturedImage.height);
    blueChannelImage = createImage(capturedImage.width, capturedImage.height);

    applyThresholding();

    isThresholdingApplied = true;
}

// Function to apply thresholding based on slider values
function applyThresholding() {
    // Load pixel data for processing
    capturedImage.loadPixels();
    redChannelImage.loadPixels();
    greenChannelImage.loadPixels();
    blueChannelImage.loadPixels();

    let redThreshold = redSlider.value();
    let greenThreshold = greenSlider.value();
    let blueThreshold = blueSlider.value();

    // Loop through each pixel and apply thresholding
    for (let i = 0; i < capturedImage.pixels.length; i += 4) {
        let r = capturedImage.pixels[i];
        let g = capturedImage.pixels[i + 1];
        let b = capturedImage.pixels[i + 2];

        // Apply thresholding for red channel
        redChannelImage.pixels[i] = r > redThreshold ? 255 : 0;
        redChannelImage.pixels[i + 1] = 0;
        redChannelImage.pixels[i + 2] = 0;
        redChannelImage.pixels[i + 3] = 255; // Alpha channel

        // Apply thresholding for green channel
        greenChannelImage.pixels[i] = 0;
        greenChannelImage.pixels[i + 1] = g > greenThreshold ? 255 : 0;
        greenChannelImage.pixels[i + 2] = 0;
        greenChannelImage.pixels[i + 3] = 255; // Alpha channel

        // Apply thresholding for blue channel
        blueChannelImage.pixels[i] = 0;
        blueChannelImage.pixels[i + 1] = 0;
        blueChannelImage.pixels[i + 2] = b > blueThreshold ? 255 : 0;
        blueChannelImage.pixels[i + 3] = 255; // Alpha channel
    }

    // Update pixels
    redChannelImage.updatePixels();
    greenChannelImage.updatePixels();
    blueChannelImage.updatePixels();

    // Display the thresholded images
    image(redChannelImage, 0, 240, 160, 120);
    image(greenChannelImage, 160, 240, 160, 120);
    image(blueChannelImage, 320, 240, 160, 120);
}
