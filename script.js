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
    const current = document.querySelector('.app-screen.active-screen');
    if (current) current.classList.remove('active-screen');

    const target = document.getElementById(screenId);
    if (target) target.classList.add('active-screen');
}

// 3. Set Up Button Click Listeners

// Screen 1: Login -> Dashboard
document.getElementById('loginBtn').addEventListener('click', () => {
    // Playing sound here unlocks mobile audio restrictions for the rest of the app session
    loginSound.play(); 

    // Aesthetic structural button transformation sequence
    this.innerHTML = '<span class="relative z-10 flex items-center gap-2"><span class="material-symbols-outlined animate-spin text-sm">autorenew</span> INITIATING SYNC...</span>';
    this.style.opacity = '0.7';
    this.style.pointerEvents = 'none';

    // Short latency buffer before state route change
    setTimeout(() => {
        navigateTo('dashboardScreen');
    }, 1500);
});

// Sound Triggers & Nav Routes
document.getElementById('triggerSoundBtn').addEventListener('click', () => {
    clickSound.play();
});

document.getElementById('toSettingsBtn').addEventListener('click', () => {
    navigateTo('settingsScreen');
});

document.getElementById('backToDashBtn').addEventListener('click', () => {
    navigateTo('dashboardScreen');
});

// Dynamic Volume Metric Feedback 
document.getElementById('volumeSlider').addEventListener('input', (e) => {
    document.getElementById('volumeVal').textContent = `${e.target.value}%`;
    // If you want to change Howler output volume on the fly:
    Howler.volume(e.target.value / 100);
});

// Subtle Ambient Canvas Mouse/Gyroscopic Response Track
document.addEventListener('mousemove', (e) => {
    const ring = document.querySelector('.loading-ring');
    if (ring && ring.offsetParent !== null) { // Only calculate if visible
        const moveX = (e.clientX - window.innerWidth / 2) / 50;
        const moveY = (e.clientY - window.innerHeight / 2) / 50;
        ring.style.transform = `translate(${moveX}px, ${moveY}px)`;
    }
});
