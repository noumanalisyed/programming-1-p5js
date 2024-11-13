let video;
let faceapi;
let detections = [];
let currentFilter = 0; // 0 = None, 1 = Grayscale, 2 = Blur, 3 = HSV, 4 = Pixelate

function setup() {
    createCanvas(640, 480);
    video = createCapture(VIDEO);
    video.size(width, height);
    video.hide();

    // Initialize Face API
    console.log("Initializing Face API...");
    faceapi = ml5.faceApi(video, {
        withLandmarks: true,
        withDescriptors: false,
        minConfidence: 0.5
    }, modelReady);
}

function modelReady() {
    console.log("Face API model loaded.");
    faceapi.detect(gotResults);
}

function gotResults(err, result) {
    if (err) {
        console.error("Error during face detection:", err);
        return;
    }

    detections = result;
    if (detections.length > 0) {
        console.log("Faces detected:", detections);
    } else {
        console.log("No faces detected.");
    }

    faceapi.detect(gotResults); // Continue detecting
}

function draw() {
    image(video, 0, 0);

    if (detections.length > 0) {
        detections.forEach(detection => {
            const { alignedRect } = detection;
            const { x, y, width, height } = alignedRect._box;

            // Draw a rectangle around the detected face
            noFill();
            stroke(0, 255, 0);
            rect(x, y, width, height);

            // Apply the selected filter to the detected face
            applyFaceFilter(x, y, width, height);
        });
    }
}

function applyFaceFilter(x, y, w, h) {
    let faceImage = video.get(x, y, w, h);

    switch (currentFilter) {
        case 1: // Grayscale filter
            faceImage.filter(GRAY);
            break;
        case 2: // Blur filter
            faceImage.filter(BLUR, 3);
            break;
        case 3: // Color-converted filter (HSV)
            faceImage = convertToHSV(faceImage);
            break;
        case 4: // Pixelate filter (5x5 blocks)
            pixelateFace(faceImage, 5);
            break;
        default:
            break;
    }

    image(faceImage, x, y, w, h); // Draw the modified face back to the canvas
}

function convertToHSV(img) {
    img.loadPixels();

    for (let i = 0; i < img.pixels.length; i += 4) {
        let r = img.pixels[i];
        let g = img.pixels[i + 1];
        let b = img.pixels[i + 2];

        let [h, s, v] = rgbToHsv(r, g, b);

        img.pixels[i] = h;
        img.pixels[i + 1] = s;
        img.pixels[i + 2] = v;
        img.pixels[i + 3] = 255;
    }

    img.updatePixels();
    return img;
}

function pixelateFace(img, pixelSize) {
    img.loadPixels();

    for (let y = 0; y < img.height; y += pixelSize) {
        for (let x = 0; x < img.width; x += pixelSize) {
            let index = (x + y * img.width) * 4;
            let r = img.pixels[index];
            let g = img.pixels[index + 1];
            let b = img.pixels[index + 2];

            for (let dy = 0; dy < pixelSize; dy++) {
                for (let dx = 0; dx < pixelSize; dx++) {
                    let pixelIndex = ((x + dx) + (y + dy) * img.width) * 4;
                    img.pixels[pixelIndex] = r;
                    img.pixels[pixelIndex + 1] = g;
                    img.pixels[pixelIndex + 2] = b;
                }
            }
        }
    }

    img.updatePixels();
}

function rgbToHsv(r, g, b) {
    r /= 255, g /= 255, b /= 255;

    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, v = max;
    let d = max - min;
    s = max == 0 ? 0 : d / max;

    if (max == min) {
        h = 0; // achromatic
    } else {
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [h * 255, s * 255, v * 255];
}

function keyPressed() {
    if (key === '1') currentFilter = 1;
    if (key === '2') currentFilter = 2;
    if (key === '3') currentFilter = 3;
    if (key === '4') currentFilter = 4;
}