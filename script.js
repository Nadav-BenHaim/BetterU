// 1. Initialize the sound
// Place your audio file in the same folder as this script, or a subfolder like 'audio/'
const sound = new Howl({
    src: ['sound-effect.mp3'], 
    html5: true // Ensures better streaming performance on mobile devices
});

const button = document.getElementById('audioBtn');
const statusText = document.getElementById('status');

// 2. Trigger playback on user click/tap
button.addEventListener('click', () => {
    sound.play();
    statusText.textContent = "Playing sound...";
    
    // Reset status text when sound finishes playing
    sound.once('end', () => {
        statusText.textContent = "Tap the button to test audio playback.";
    });
});