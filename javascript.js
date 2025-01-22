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

            // Show the result in the output area
            document.getElementById("ascii-output").textContent = asciiImage;

            // Get selected format
            const selectedFormat = document.getElementById("format-select").value;

            if (selectedFormat === 'txt') {
                // Create a Blob with the ASCII content for TXT
                const blob = new Blob([asciiImage], { type: 'text/plain' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = 'ascii_image.txt';  // Filename for download
                link.click();
            } else if (selectedFormat === 'png' || selectedFormat === 'jpg') {
                // Convert ASCII to Image (using canvas for PNG/JPG)
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = resizedImage.width;
                canvas.height = resizedImage.height;

                ctx.fillStyle = 'black';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = 'white';
                ctx.font = 'monospace 10px';

                const lineHeight = 12;
                let y = 0;
                for (let i = 0; i < asciiImage.length; i++) {
                    const char = asciiImage[i];
                    ctx.fillText(char, 10, y * lineHeight + 10);
                    if (asciiImage[i] === '\n') {
                        y++;
                    }
                }

                // Convert canvas to image file and download
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

