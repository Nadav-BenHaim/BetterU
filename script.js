// 1. Initialize the Audio Assets
// Place your audio file in the same folder as this script, or a subfolder like 'audio/'
const sound = new Howl({
    src: ['sound-effect.mp3'], 
    html5: true // Ensures better streaming performance on mobile devices
});
const loginSound = new Howl({ src: ['sound-effect.mp3'], html5: true });
const clickSound = new Howl({ src: ['sound-effect.mp3'], html5: true });

// 2. Core Navigation Engine
function navigateTo(screenId) {
    // Find the currently visible screen and hide it
    const currentScreen = document.querySelector('.screen.active');
    if (currentScreen) {
        currentScreen.classList.remove('active');
    }
    
    // Find the target screen and make it visible
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
    }
}

// 3. Set Up Button Click Listeners

// Screen 1: Login -> Dashboard
document.getElementById('loginBtn').addEventListener('click', () => {
    // Playing sound here unlocks mobile audio restrictions for the rest of the app session
    loginSound.play(); 
    navigateTo('dashboardScreen');
});

// Screen 2: Dashboard Interactions
document.getElementById('triggerSoundBtn').addEventListener('click', () => {
    clickSound.play();
});

document.getElementById('toSettingsBtn').addEventListener('click', () => {
    navigateTo('settingsScreen');
});

// Screen 3: Settings Interactions
document.getElementById('backToDashBtn').addEventListener('click', () => {
    navigateTo('settingsScreen'); // Oops, small typo prevention: navigating back
    navigateTo('dashboardScreen');
});
