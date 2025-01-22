document.getElementById('image-upload').addEventListener('change', handleImageUpload);
document.getElementById('generate-button').addEventListener('click', handleGenerate);
document.getElementById('potentiometer1').addEventListener('click', handlePotentiometer1);
document.getElementById('potentiometer2').addEventListener('click', handlePotentiometer2);
document.getElementById('potentiometer3').addEventListener('click', handlePotentiometer3);

let originalAsciiArt = '';
let modifiedAsciiArt = '';
let potentiometer1Value = '1'; // Default value for potentiometer 1
let potentiometer2Value = '2'; // Default value for potentiometer 2
let potentiometer3Value = '3'; // Default value for potentiometer 3

// Handle Image Upload
function handleImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const imageUrl = e.target.result;
            convertImageToAscii(imageUrl);
        };
        reader.readAsDataURL(file);
    }
}

// Convert image to ASCII Art
function convertImageToAscii(imageUrl) {
    // Placeholder ASCII art generation (this would be replaced with actual logic)
    originalAsciiArt = '######\n#    #\n#    #\n######';
    modifiedAsciiArt = originalAsciiArt;

    // Show ASCII Art in the live preview box
    updateLivePreview(modifiedAsciiArt);

    // Show the download button once ASCII Art is ready
    document.getElementById('download-button').style.display = 'inline-block';
}

// Update Live Preview
function updateLivePreview(asciiArt) {
    document.getElementById('live-preview').textContent = asciiArt;
}

// Handle Generate Button Click
function handleGenerate(event) {
    event.preventDefault();
    
    // Get the file format selected by the user
    const format = document.getElementById('format-select').value;
    
    // Convert ASCII art to the selected file format
    const blob = new Blob([modifiedAsciiArt], { type: `text/${format}` });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `ascii-art.${format}`;
    link.click();
}

// Handle Potentiometer 1 Button Click
function handlePotentiometer1() {
    // Modify ASCII Art based on potentiometer 1 value
    potentiometer1Value = (parseInt(potentiometer1Value) % 3 + 1).toString();
    modifiedAsciiArt = originalAsciiArt.replace(/#/g, potentiometer1Value);
    updateLivePreview(modifiedAsciiArt);
}

// Handle Potentiometer 2 Button Click
function handlePotentiometer2() {
    // Modify ASCII Art based on potentiometer 2 value
    potentiometer2Value = (parseInt(potentiometer2Value) % 3 + 1).toString();
    modifiedAsciiArt = originalAsciiArt.replace(/#/g, potentiometer2Value);
    updateLivePreview(modifiedAsciiArt);
}

// Handle Potentiometer 3 Button Click
function handlePotentiometer3() {
    // Modify ASCII Art based on potentiometer 3 value
    potentiometer3Value = (parseInt(potentiometer3Value) % 3 + 1).toString();
    modifiedAsciiArt = originalAsciiArt.replace(/#/g, potentiometer3Value);
    updateLivePreview(modifiedAsciiArt);
}
