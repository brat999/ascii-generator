function generateASCII(event) {
    event.preventDefault();

    const fileInput = document.getElementById("image-upload");
    const file = fileInput.files[0];

    if (!file) {
        alert("Please select an image.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            const resizedImage = resizeImage(img, 100);
            const grayImage = grayify(resizedImage);
            const asciiImage = pixelsToASCII(grayImage);

            document.getElementById("ascii-output").textContent = asciiImage;
            document.getElementById("live-preview").textContent = asciiImage;

            const selectedFormat = document.getElementById("format-select").value;

            if (selectedFormat === 'txt') {
                // Generate text file for download
                const blob = new Blob([asciiImage], { type: 'text/plain' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = 'ascii_image.txt';
                document.getElementById("download-link-container").style.display = "block";
                document.getElementById("download-link").href = link.href;
            } else if (selectedFormat === 'png' || selectedFormat === 'jpg') {
                // Generate image file for download
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = resizedImage.width * 10;
                canvas.height = resizedImage.height * 12;

                ctx.fillStyle = 'black';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = 'white';
                ctx.font = 'monospace 10px';

                const lineHeight = 12;
                let y = 0;
                let x = 0;
                for (let i = 0; i < asciiImage.length; i++) {
                    const char = asciiImage[i];
                    if (char === '\n') {
                        y++;
                        x = 0;
                    } else {
                        ctx.fillText(char, x * 10, y * lineHeight + 10);
                        x++;
                    }
                }

                canvas.toBlob(function(blob) {
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    link.download = 'ascii_image.' + selectedFormat;
                    document.getElementById("download-link-container").style.display = "block";
                    document.getElementById("download-link").href = link.href;
                }, selectedFormat === 'png' ? 'image/png' : 'image/jpeg');
            }
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
}

document.getElementById("image-form").addEventListener("submit", generateASCII);

function resizeImage(image, maxWidth) {
    const canvas = document.createElement('canvas');
    const ratio = maxWidth / image.width;
    canvas.width = maxWidth;
    canvas.height = image.height * ratio;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas;
}

function grayify(image) {
    const ctx = image.getContext('2d');
    const data = ctx.getImageData(0, 0, image.width, image.height);
    for (let i = 0; i < data.data.length; i += 4) {
        const gray = 0.3 * data.data[i] + 0.59 * data.data[i + 1] + 0.11 * data.data[i + 2];
        data.data[i] = data.data[i + 1] = data.data[i + 2] = gray;
    }
    ctx.putImageData(data, 0, 0);
    return image;
}

function pixelsToASCII(image) {
    const ctx = image.getContext('2d');
    const data = ctx.getImageData(0, 0, image.width, image.height);
    const asciiImage = [];
    const characters = ['@', '%', '#', '*', '+', '=', '-', ':', '.', ' '];
    const width = image.width;

    for (let i = 0; i < data.data.length; i += 4) {
        const brightness = (0.3 * data.data[i] + 0.59 * data.data[i + 1] + 0.11 * data.data[i + 2]) / 255;
        const char = characters[Math.floor(brightness * (characters.length - 1))];
        if (i / 4 % width === 0 && i > 0) {
            asciiImage.push('\n');
        }
        asciiImage.push(char);
    }

    return asciiImage.join('');
}
