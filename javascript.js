// Wichtige Variablen
const imageInput = document.getElementById('image-upload');
const generateButton = document.getElementById('generate-button');
const downloadButton = document.getElementById('download-button');
const formatSelect = document.getElementById('format-select');
const previewContainer = document.getElementById('preview-container');
const controlButtons = document.querySelectorAll('.control-button');

let uploadedImage = null; // Speichert das hochgeladene Bild
let asciiArt = ''; // Speichert die ASCII-Kunst

// Event-Listener für das Hochladen eines Bildes
imageInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.onload = () => {
                uploadedImage = img;
                updatePreview(); // Vorschau aktualisieren
            };
        };
        reader.readAsDataURL(file);
    }
});

// Funktion zur Aktualisierung der Vorschau
function updatePreview() {
    previewContainer.innerHTML = ''; // Vorherige Inhalte entfernen
    if (uploadedImage) {
        previewContainer.appendChild(uploadedImage); // Bild anzeigen
    }
}

// Event-Listener für die Buttons
controlButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
        modifyAscii(index + 1); // ASCII-Zeichen basierend auf Button ändern
        updatePreview(); // Vorschau aktualisieren
    });
});

// Funktion zur Modifikation der ASCII-Kunst
function modifyAscii(buttonIndex) {
    if (!uploadedImage) return;

    // Beispiel für Anpassung der Zeichen basierend auf dem Button
    // Ersetze diese Funktion durch deinen ASCII-Generator-Algorithmus
    const asciiChars = ['@', '#', 'S', '%', '?', '*', '+', ';', ':', ',', '.'];
    const newChars = asciiChars.map((char, idx) =>
        idx % 4 === buttonIndex - 1 ? char.toLowerCase() : char
    );

    asciiArt = `Modified ASCII with Button ${buttonIndex}: ${newChars.join('')}`;
}

// Event-Listener für den Generieren-Button
generateButton.addEventListener('click', () => {
    if (!uploadedImage) {
        alert('Bitte laden Sie ein Bild hoch, bevor Sie es generieren.');
        return;
    }

    // Simulierte ASCII-Generierung (hier kannst du deinen Algorithmus einfügen)
    asciiArt = 'Beispiel ASCII-Kunst...\n@#$%^&*()\n++++++++++';

    alert('ASCII-Kunst generiert!');
});

// Event-Listener für den Download-Button
downloadButton.addEventListener('click', () => {
    if (!asciiArt) {
        alert('Bitte generieren Sie die ASCII-Kunst zuerst.');
        return;
    }

    const format = formatSelect.value;
    let dataStr, fileName;

    if (format === 'txt') {
        dataStr = asciiArt;
        fileName = 'ascii_art.txt';
    } else if (format === 'png' || format === 'jpg') {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        canvas.width = uploadedImage.width;
        canvas.height = uploadedImage.height;

        context.fillStyle = '#000';
        context.fillRect(0, 0, canvas.width, canvas.height);

        context.fillStyle = '#fff';
        context.font = '10px monospace';
        context.fillText(asciiArt, 10, 20);

        const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
        dataStr = canvas.toDataURL(mimeType);
        fileName = `ascii_art.${format}`;
    }

    const a = document.createElement('a');
    a.href = dataStr;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
});
