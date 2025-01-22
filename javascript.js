function generateASCII(event) {
    event.preventDefault();  // Verhindert das Standardverhalten (Formularabsendung)

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

            // Zeige das ASCII-Bild im Pre-Tag an
            document.getElementById("ascii-output").textContent = asciiImage;

            // Wähle das Format aus
            const selectedFormat = document.getElementById("format-select").value;

            if (selectedFormat === 'txt') {
                // Erstelle eine Blob mit dem ASCII-Text für .txt
                const blob = new Blob([asciiImage], { type: 'text/plain' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = 'ascii_image.txt';  // Dateiname
                link.click();  // Startet den Download
            } else if (selectedFormat === 'png' || selectedFormat === 'jpg') {
                // Konvertiere ASCII zu Bild (using Canvas für PNG/JPG)
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = resizedImage.width * 10;  // Die Breite des Canvas wird entsprechend der Anzahl der Zeichen multipliziert
                canvas.height = resizedImage.height * 12; // Höhe für Zeilenhöhe (also die Höhe der Zeichen)

                ctx.fillStyle = 'black';
                ctx.fillRect(0, 0, canvas.width, canvas.height);  // Setzt den Hintergrund des Canvas auf schwarz
                ctx.fillStyle = 'white';
                ctx.font = 'monospace 10px';  // Wählen Sie eine Monospace-Schriftart

                const lineHeight = 12;
                let y = 0;
                let x = 0;
                for (let i = 0; i < asciiImage.length; i++) {
                    const char = asciiImage[i];
                    if (char === '\n') {
                        y++;
                        x = 0;  // Startet eine neue Zeile
                    } else {
                        ctx.fillText(char, x * 10, y * lineHeight + 10);  // Zeichnet das ASCII-Zeichen
                        x++;
                    }
                }

                // Konvertiere Canvas zu einem Blob (PNG/JPG)
                canvas.toBlob(function(blob) {
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    link.download = 'ascii_image.' + selectedFormat; // Dateiname und Format
                    link.click();  // Startet den Download
                }, selectedFormat === 'png' ? 'image/png' : 'image/jpeg');
            }
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
}

document.getElementById("image-form").addEventListener("submit", generateASCII);
