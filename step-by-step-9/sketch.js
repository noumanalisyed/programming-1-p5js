let video;
let capturedImage;
let redChannelImage, greenChannelImage, blueChannelImage;
let isGreyCaptured = false;
let isRGBCaptured = false;
let brightnessSlider;
let thresholdSliderR, thresholdSliderG, thresholdSliderB;
let isThresholded = false;
let hsvImage, labImage;

function setup() {
  createCanvas(800, 600); // Increased the canvas size for extra space
  background(200);

  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide(); // Hide the original video feed

  fill(0);
  textSize(16);
  text("Press any key to capture and process the image into RGB channels", 10, height - 20);

  // Create sliders for RGB thresholds
  thresholdSliderR = createSlider(0, 255, 128);
  thresholdSliderR.position(10, 550);
  thresholdSliderG = createSlider(0, 255, 128);
  thresholdSliderG.position(170, 550);
  thresholdSliderB = createSlider(0, 255, 128);
  thresholdSliderB.position(330, 550);

  // Create a slider for brightness adjustment
  brightnessSlider = createSlider(-100, 100, 20);
  brightnessSlider.position(490, 550);

  // Event listeners for sliders
  thresholdSliderR.input(applyThresholding);
  thresholdSliderG.input(applyThresholding);
  thresholdSliderB.input(applyThresholding);
  brightnessSlider.input(grayScaled);
}

function draw() {
  background(200); // Clear the canvas each frame

  // Draw the webcam stream in the center of the canvas
  image(video, 80, 50, 640, 480);

  // Draw RGB channel images in specific grid positions
  if (isRGBCaptured) {
    image(redChannelImage, 10, 10, 100, 75);
    image(greenChannelImage, 120, 10, 100, 75);
    image(blueChannelImage, 230, 10, 100, 75);
  }

  // Draw grayscale and processed images
  if (isGreyCaptured) {
    image(capturedImage, 340, 10, 100, 75);
    image(processedImage, 450, 10, 100, 75);
  }

  // Draw thresholded images in a grid
  if (isThresholded) {
    image(thresholdedR, 560, 10, 100, 75);
    image(thresholdedG, 670, 10, 100, 75);
    image(thresholdedB, 780, 10, 100, 75);
  }

  // Draw the HSV and LAB converted images
  if (hsvImage) {
    image(hsvImage, 10, 100, 100, 75);
  }

  if (labImage) {
    image(labImage, 120, 100, 100, 75);
  }
}

function keyPressed() {
  grayScaled();
  RGBChannelSplitting();
  applyThresholding();
  convertToHSV();
  convertToLAB();
}

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
    gray = min(gray + brightnessSlider.value(), 255);

    processedImage.pixels[i] = gray;
    processedImage.pixels[i + 1] = gray;
    processedImage.pixels[i + 2] = gray;
  }
  processedImage.updatePixels();
  isGreyCaptured = true;
}

function applyThresholding() {
  thresholdedR = createImage(capturedImage.width, capturedImage.height);
  thresholdedG = createImage(capturedImage.width, capturedImage.height);
  thresholdedB = createImage(capturedImage.width, capturedImage.height);

  capturedImage.loadPixels();
  thresholdedR.loadPixels();
  thresholdedG.loadPixels();
  thresholdedB.loadPixels();

  for (let i = 0; i < capturedImage.pixels.length; i += 4) {
    let r = capturedImage.pixels[i];
    let g = capturedImage.pixels[i + 1];
    let b = capturedImage.pixels[i + 2];

    thresholdedR.pixels[i] = r > thresholdSliderR.value() ? 255 : 0;
    thresholdedG.pixels[i + 1] = g > thresholdSliderG.value() ? 255 : 0;
    thresholdedB.pixels[i + 2] = b > thresholdSliderB.value() ? 255 : 0;
  }

  thresholdedR.updatePixels();
  thresholdedG.updatePixels();
  thresholdedB.updatePixels();

  isThresholded = true;
}

function convertToHSV() {
  capturedImage = video.get();
  hsvImage = createImage(capturedImage.width, capturedImage.height);

  capturedImage.loadPixels();
  hsvImage.loadPixels();

  for (let i = 0; i < capturedImage.pixels.length; i += 4) {
    let r = capturedImage.pixels[i] / 255;
    let g = capturedImage.pixels[i + 1] / 255;
    let b = capturedImage.pixels[i + 2] / 255;

    let maxVal = max(r, g, b);
    let minVal = min(r, g, b);
    let h, s, v = maxVal;

    let d = maxVal - minVal;
    s = maxVal == 0 ? 0 : d / maxVal;

    if (maxVal == minVal) {
      h = 0;
    } else {
      switch (maxVal) {
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

    hsvImage.pixels[i] = h * 255;
    hsvImage.pixels[i + 1] = s * 255;
    hsvImage.pixels[i + 2] = v * 255;
    hsvImage.pixels[i + 3] = 255;
  }

  hsvImage.updatePixels();
}

function convertToLAB() {
  capturedImage = video.get();
  labImage = createImage(capturedImage.width, capturedImage.height);

  capturedImage.loadPixels();
  labImage.loadPixels();

  for (let i = 0; i < capturedImage.pixels.length; i += 4) {
    let r = capturedImage.pixels[i] / 255;
    let g = capturedImage.pixels[i + 1] / 255;
    let b = capturedImage.pixels[i + 2] / 255;

    let x = r * 0.4124 + g * 0.3576 + b * 0.1805;
    let y = r * 0.2126 + g * 0.7152 + b * 0.0722;
    let z = r * 0.0193 + g * 0.1192 + b * 0.9505;

    x /= 0.95047;
    y /= 1.00000;
    z /= 1.08883;

    let labL = 116 * f(y) - 16;
    let labA = 500 * (f(x) - f(y));
    let labB = 200 * (f(y) - f(z));

    labImage.pixels[i] = labL / 100 * 255;
    labImage.pixels[i + 1] = (labA + 128) / 255 * 255;
    labImage.pixels[i + 2] = (labB + 128) / 255 * 255;
    labImage.pixels[i + 3] = 255;
  }

  labImage.updatePixels();
}

function f(t) {
  return t > 0.008856 ? pow(t, 1 / 3) : 7.787 * t + 16 / 116;
}

/*
Video Capture:

We use createCapture(VIDEO) to access the webcam.
The video is hidden using video.hide() to prevent it from being displayed directly on the canvas.
Drawing the Video Feed:

The video is drawn on the canvas using the image(video, 0, 0, width, height) function.
Capturing an Image:

The keyPressed() function captures the current frame from the video feed when any key is pressed.
Processing the Image:

The image is processed by converting it to grayscale. This is done by averaging the red, green, and blue (RGB) values of each pixel.
The brightness is increased by 20%, ensuring it doesn't exceed 255 using the min(gray + gray * 0.2, 255) calculation.
Displaying the Original and Processed Images:

The original image is displayed in a grid position.
The processed image (grayscale and brightness adjusted) is displayed in another grid position on the canvas.
How It Works:
Running the Sketch: When you run this sketch, the webcam feed will be displayed on the canvas.
Capturing and Processing an Image: Press any key to capture the current frame from the webcam. The captured image will be processed to grayscale with brightness adjustment and displayed in the designated positions on the canvas.

 */

/*

Video Capture:

The webcam is accessed using createCapture(VIDEO), and the video feed is hidden with video.hide().
Drawing the Video Feed:

The video feed is displayed on the canvas using image(video, 0, 0, width, height).
Capturing an Image:

When any key is pressed, the current frame from the video feed is captured and stored in capturedImage.
RGB Channel Processing:

Three separate images (redChannelImage, greenChannelImage, and blueChannelImage) are created to store the red, green, and blue channels of the original image.
The for loop iterates over each pixel, extracting the RGB values.
The red channel keeps the red value, setting green and blue to 0.
The green channel keeps the green value, setting red and blue to 0.
The blue channel keeps the blue value, setting red and green to 0.
Displaying the RGB Channels:

The processed images for each channel are displayed in the grid at specific positions on the canvas.
How It Works:
Running the Sketch: When you run this sketch, the webcam feed will be displayed on the canvas.
Capturing and Processing the Image: Press any key to capture the current frame from the webcam. The captured image will be split into its red, green, and blue channels, which will be displayed in the designated positions on the canvas.
 */

/*
Sliders: Three sliders (redSlider, greenSlider, blueSlider) are created to set the threshold values for the Red, Green, and Blue channels.
Thresholding: For each pixel, the threshold is applied by comparing the channel value against the corresponding slider value. If the value is above the threshold, it's set to 255; otherwise, it's set to 0.
Displaying Thresholded Images:

Brightness Slider: A brightness slider (brightnessSlider) is added and positioned below the canvas, just like the other sliders.
Brightness Adjustment: The grayscale conversion now includes a brightness adjustment based on the slider value, which can range from 0 to 100%. The brightness is increased by a percentage relative to the original grayscale value, and the result is clamped to ensure it doesn't exceed 255.

 Event Handling Added:
Each slider now has an .input() method assigned, which is called whenever the slider value changes.
For the RGB sliders (redSlider, greenSlider, blueSlider), the applyThresholding() function is called whenever the slider is adjusted.
For the brightness slider (brightnessSlider), the grayScaled() function is called whenever the slider is adjusted.


 */

/*
convertToHSV: Converts the captured image to HSV color space by calculating the hue,
              saturation, and value for each pixel.
convertToLAB: Converts the captured image to LAB color space by calculating the luminance (L)
              and color-opponent dimensions (A and B) for each pixel.
f function: Used in the LAB conversion to normalize the XYZ values.
Now, when you press a key, the image will be captured, converted to grayscale,
RGB channel split, thresholded, and also converted to HSV and LAB color spaces.
The HSV and LAB images will be displayed in the corresponding grid positions.
 */