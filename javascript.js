document.addEventListener("DOMContentLoaded", () => {
    const imageForm = document.getElementById('image-form');
    const imageUpload = document.getElementById('image-upload');
    const formatSelect = document.getElementById('format-select');
    const generateButton = document.getElementById('generate-button');
    const previewBox = document.getElementById('preview-box');
    const downloadButton = document.getElementById('download-button');

    const asciiCharacters = ['@', '#', '8', '&', '%', '$', '+', '=', '-', ':', '.', ' ']; // ASCII-Zeichen für Graustufen

    // Graustufen-Umwandlung und ASCII-Art-Erstellung
    function convertImageToASCII(image) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const width = image.width;
        const height = image.height;
        
        // Skalieren des Bildes für eine bessere ASCII-Darstellung
        const maxWidth = 100; // Maximale Breite für die ASCII-Darstellung
        const scale = maxWidth / width;
        const newWidth = maxWidth;
        const newHeight = height * scale;
        
        canvas.width = newWidth;
        canvas.height = newHeight;

        ctx.drawImage(image, 0, 0, newWidth, newHeight);

        const imageData = ctx.getImageData(0, 0, newWidth, newHeight);
        const data = imageData.data;

        let asciiArt = '';
        for (let y = 0; y < newHeight; y++) {
            for (let x = 0; x < newWidth; x++) {
                const i = (y * newWidth + x) * 4;
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];

                // Berechnung des Grauwerts
                const gray = Math.floor(0.3 * r + 0.59 * g + 0.11 * b);
                
                // ASCII-Zeichen anhand des Grauwerts auswählen
                const char = asciiCharacters[Math.floor((gray / 255) * (asciiCharacters.length - 1))];
                
                asciiArt += char;
            }
            asciiArt += '\n';
        }

        return asciiArt;
    }

    // Event-Listener für das Formular
    imageForm.addEventListener('submit', (event) => {
        event.preventDefault();
        
        const file = imageUpload.files[0];
        const format = formatSelect.value;

        if (file) {
            const reader = new FileReader();

            reader.onload = () => {
                const img = new Image();
                img.src = reader.result;
                img.onload = () => {
                    const asciiArt = convertImageToASCII(img);
                    previewBox.textContent = asciiArt; // Zeigt das ASCII-Bild in der Vorschau
                };
            };

            reader.readAsDataURL(file);
        } else {
            alert('Bitte ein Bild auswählen!');
        }
    });

    // Event-Listener für das Downloaden der ASCII-Datei
    downloadButton.addEventListener('click', () => {
        const asciiArt = previewBox.textContent;
        const format = formatSelect.value;
        const fileName = 'ascii_output.' + format;

        const blob = new Blob([asciiArt], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
    });

    // Optional: Button-Interaktionen für die Manipulation der ASCII-Zeichen
    const potButtons = document.querySelectorAll('.pot-button');
    potButtons.forEach(button => {
        button.addEventListener('click', () => {
            const row = button.getAttribute('data-row');
            const col = button.getAttribute('data-col');
            console.log(`Button in Reihe ${row}, Spalte ${col} wurde geklickt`);

            // Hier könntest du die Logik hinzufügen, um die ASCII-Zeichen zu manipulieren
            // z.B. Indizes in einer Matrix ändern, basierend auf den Button-Klicks
        });
    });
});
