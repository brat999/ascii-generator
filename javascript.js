document.getElementById('generate-button').addEventListener('click', function(event) {
    event.preventDefault();

    // Lade das Bild
    const fileInput = document.getElementById('image-upload');
    const file = fileInput.files[0];
    if (!file) {
        alert('Bitte eine Datei auswählen!');
        return;
    }

    // Hole das ausgewählte Format
    const format = document.getElementById('format-select').value;

    // Lese die Bilddatei als DataURL
    const reader = new FileReader();
    reader.onload = function(e) {
        const imageUrl = e.target.result;
        
        // Generiere das ASCII-Bild
        generateAsciiArt(imageUrl, format);
    };
    reader.readAsDataURL(file);
});

function generateAsciiArt(imageUrl, format) {
    // Erstelle ein Canvas-Element
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    const img = new Image();
    img.onload = function() {
        // Setze die Canvas-Größe
        canvas.width = img.width;
        canvas.height = img.height;

        // Zeichne das Bild auf das Canvas
        ctx.drawImage(img, 0, 0, img.width, img.height);
        
        // Holen Sie sich die Bilddaten (Pixelwerte)
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;

        // Wandeln Sie das Bild in ASCII um
        let asciiArt = '';
        for (let i = 0; i < pixels.length; i += 4) {
            const r = pixels[i];
            const g = pixels[i + 1];
            const b = pixels[i + 2];

            // Berechne die Helligkeit des Pixels
            const brightness = (r + g + b) / 3;
            const asciiChar = getAsciiChar(brightness);
            asciiArt += asciiChar;

            // Wenn wir das Ende einer Zeile erreicht haben, fügen wir einen Zeilenumbruch hinzu
            if ((i / 4 + 1) % canvas.width === 0) {
                asciiArt += '\n';
            }
        }

        // Zeige die ASCII-Art in der Live-Vorschau an
        document.getElementById('ascii-output').textContent = asciiArt;

        // Aktualisiere die Live-Vorschau mit Potentiometer-Anpassungen
        updateLivePreview(asciiArt);

        // Erstelle den Download-Link
        const downloadLink = document.createElement('a');
        downloadLink.download = 'ascii_art.' + format;
        
        if (format === 'txt') {
            const blob = new Blob([asciiArt], { type: 'text/plain' });
            downloadLink.href = URL.createObjectURL(blob);
        } else if (format === 'png' || format === 'jpg') {
            canvas.toBlob(function(blob) {
                downloadLink.href = URL.createObjectURL(blob);
            }, 'image/' + format);
        }

        // Füge den Download-Link auf der Seite hinzu
        const downloadLinkContainer = document.getElementById('download-link-container');
        downloadLinkContainer.innerHTML = ''; // Leere den alten Link
        downloadLinkContainer.appendChild(downloadLink);
        downloadLink.textContent = 'Klicke hier, um dein Bild herunterzuladen';
    };

    img.src = imageUrl;
}

// Funktion zur Bestimmung des ASCII-Zeichens basierend auf der Helligkeit
function getAsciiChar(brightness) {
    const asciiChars = ['@', '#', 'S', '%', '?', '*', '+', ';', ':', ',', '.'];
    const index = Math.floor((brightness / 255) * (asciiChars.length - 1));
    return asciiChars[index];
}

// Live-Vorschau Funktion (Potentiometer-Anpassungen)
function updateLivePreview(asciiArt) {
    let adjustedAscii = asciiArt;
    // Beispiel für das Anpassen der Zeichen mit Potentiometer
    // Hier können Werte für verschiedene Potentiometer eingestellt werden
    const potentiometerValues = getPotentiometerValues();

    adjustedAscii = adjustedAscii.replace(/[S#@%?*+;:,.]/g, function(match) {
        return potentiometerValues[0] + match + potentiometerValues[1] + match + potentiometerValues[2];
    });

    // Zeige die angepasste ASCII-Art in der Vorschau an
    document.getElementById('live-preview').textContent = adjustedAscii;
}

// Funktion zum Abrufen der potentiometer Werte
function getPotentiometerValues() {
    const potentiometer1 = document.getElementById('potentiometer1').value;
    const potentiometer2 = document.getElementById('potentiometer2').value;
    const potentiometer3 = document.getElementById('potentiometer3').value;

    return [potentiometer1, potentiometer2, potentiometer3];
}

// Potentiometer EventListener
document.querySelectorAll('.potentiometer-button').forEach(function(button) {
    button.addEventListener('click', function() {
        // Potentiometer Werte aktualisieren und Vorschau anpassen
        updateLivePreview(document.getElementById('ascii-output').textContent);
    });
});
