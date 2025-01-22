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
                const blob = new Blob([asciiImage], { type: 'text/plain' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = 'ascii_image.txt';
                link.click();
            } else if (selectedFormat === 'png' || selectedFormat === 'jpg') {
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
                    link.click();
                }, selectedFormat === 'png' ? 'image/png' : 'image/jpeg');
            }
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
}

document.getElementById("image-form").addEventListener("submit", generateASCII);

const potentiometer1 = document.getElementById('potentiometer-1');
const potentiometer2 = document.getElementById('potentiometer-2');
const potentiometer3 = document.getElementById('potentiometer-3');

function updateLivePreview() {
    const asciiImage = document.getElementById("ascii-output").textContent;

    const range1 = ['#', '@', '%', '&', '$', 'A', 'B', 'C', 'D', 'E'];
    const range2 = ['*', '+', '-', '_', '=', '/', '\\', '|', '<', '>'];
    const range3 = ['.', ':', ',', ';', '~', '!', '^', '>', '<', '?'];

    const adjustedAsciiImage = asciiImage.split('').map((char, index) => {
        if (index < 3) return range1[potentiometer1.value];
        if (index < 6) return range2[potentiometer2.value];
        if (index < 9) return range3[potentiometer3.value];
        return char;
    }).join('');

    document.getElementById("live-preview").textContent = adjustedAsciiImage;
}

potentiometer1.addEventListener('input', updateLivePreview);
potentiometer2.addEventListener('input', updateLivePreview);
potentiometer3.addEventListener('input', updateLivePreview);
