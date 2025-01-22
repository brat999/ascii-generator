// Global variables
const imageUpload = document.getElementById("image-upload");
const previewBox = document.getElementById("preview-box");
const generateButton = document.getElementById("generate-button");
const downloadButton = document.getElementById("download-button");
const formatSelect = document.getElementById("format-select");

const ASCII_CHARS = ["‹", "!", "#", "Ç", "-", "_", "#", "?", "“", "≠", " "];

// Resize image according to a new width while maintaining aspect ratio
function resizeImage(image, newWidth = 100) {
    const ratio = image.height / image.width;
    const newHeight = Math.round(newWidth * ratio);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = newWidth;
    canvas.height = newHeight;
    ctx.drawImage(image, 0, 0, newWidth, newHeight);
    return canvas;
}

// Convert image to grayscale
function grayify(image) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0);
    const imageData = ctx.getImageData(0, 0, image.width, image.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        const avg = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]; // RGB to grayscale
        data[i] = data[i + 1] = data[i + 2] = avg; // Set red, green, blue to the grayscale value
    }
    ctx.putImageData(imageData, 0, 0);
    return canvas;
}

// Convert grayscale pixels to ASCII characters
function pixelsToASCII(image) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0);

    const imageData = ctx.getImageData(0, 0, image.width, image.height);
    const pixels = imageData.data;
    let asciiImage = "";

    for (let i = 0; i < pixels.length; i += 4) {
        const brightness = Math.floor((pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3);
        const asciiChar = ASCII_CHARS[Math.floor(brightness / 25)];
        asciiImage += asciiChar;

        if ((i / 4 + 1) % image.width === 0) {
            asciiImage += "\n";
        }
    }

    return asciiImage;
}

// Handle image upload and generate ASCII art
function handleImageUpload(event) {
    event.preventDefault();

    const file = imageUpload.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        const image = new Image();
        image.src = e.target.result;
        image.onload = function () {
            const resizedImage = resizeImage(image, 100);
            const grayImage = grayify(resizedImage);
            const asciiArt = pixelsToASCII(grayImage);
            previewBox.textContent = asciiArt; // Display the ASCII art
        };
    };
    reader.readAsDataURL(file);
}

// Download the generated ASCII art
function downloadASCII() {
    if (!previewBox.textContent) return;

    const asciiArt = previewBox.textContent;
    const format = formatSelect.value;
    let blob;

    if (format === "txt") {
        blob = new Blob([asciiArt], { type: "text/plain" });
    }

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "ascii_art." + format;
    link.click();
}

// Event listeners
document.getElementById("image-form").addEventListener("submit", handleImageUpload);
downloadButton.addEventListener("click", downloadASCII);
generateButton.addEventListener("click", handleImageUpload);
