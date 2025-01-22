document.getElementById('image-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const file = document.getElementById('image-upload').files[0];
    if (!file) {
        alert('Bitte ein Bild auswählen!');
        return;
    }

    const format = document.getElementById('format-select').value;
    const reader = new FileReader();

    reader.onload = function(e) {
        const img = new Image();
        img.src = e.target.result;

        img.onload = function() {
            const asciiArt = generateASCIIArt(img);
            displayPreview(asciiArt);

            document.getElementById('download-button').onclick = function() {
                downloadASCII(asciiArt, format);
            };
        };
    };

    reader.readAsDataURL(file);
});

function generateASCIIArt(image) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const targetWidth = 100; // Dynamische Anpassung hier möglich
    const ratio = image.height / image.width;
    const targetHeight = Math.round(targetWidth * ratio);

    canvas.width = targetWidth;
    canvas.height = targetHeight;
    ctx.drawImage(image, 0, 0, targetWidth, targetHeight);

    const imageData = ctx.getImageData(0, 0, targetWidth, targetHeight);
    const asciiChars = ['@', '#', '8', '&', '%', '$', 'O', '+', '=', '-', '.', ' '];

    let asciiArt = '';
    for (let i = 0; i < targetHeight; i++) {
        for (let j = 0; j < targetWidth; j++) {
            const index = (i * targetWidth + j) * 4;
            const r = imageData.data[index];
            const g = imageData.data[index + 1];
            const b = imageData.data[index + 2];
            const gray = Math.round(0.2126 * r + 0.7152 * g + 0.0722 * b); // Luminosity-Formel
            const charIndex = Math.floor((gray / 255) * (asciiChars.length - 1));
            asciiArt += asciiChars[charIndex];
        }
        asciiArt += '\n';
    }

    return asciiArt;
}

function displayPreview(asciiArt) {
    document.getElementById('preview-box').textContent = asciiArt;
}

function downloadASCII(asciiArt, format) {
    let blob;
    if (format === 'txt') {
        blob = new Blob([asciiArt], { type: 'text/plain' });
    } else {
        alert('Nur .txt Download wird unterstützt!');
        return;
    }

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'ascii_image.' + format;
    link.click();
}
