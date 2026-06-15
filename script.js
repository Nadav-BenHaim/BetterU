// 1. Initialize the Audio Assets
// Place your audio file in the same folder as this script, or a subfolder like 'audio/'
const sound = new Howl({
    src: ['sound-effect.mp3'], 
    html5: true // Ensures better streaming performance on mobile devices
});
// const loginSound = new Howl({ src: ['sound-effect.mp3'], html5: true });
// const clickSound = new Howl({ src: ['sound-effect.mp3'], html5: true });

// 2. Core Navigation Engine
function navigateTo(screenId) {
    const current = document.querySelector('.app-screen.active-screen');
    const target = document.getElementById(screenId);

    if (current) {
        current.style.opacity = '0';
        // Wait for the fade-out duration before switching displays
        setTimeout(() => {
            current.classList.remove('active-screen');
            current.style.display = 'none';
            
            if (target) {
                target.style.display = 'flex';
                // Trigger a tiny micro-task buffer so the browser catches the display shift before fading in
                setTimeout(() => {
                    target.classList.add('active-screen');
                    target.style.opacity = '1';
                }, 20);
            }
        }, 300);
    } else if (target) {
        target.style.display = 'flex';
        target.classList.add('active-screen');
        target.style.opacity = '1';
    }
}

// 3. Set Up Button Click Listeners

// Screen 1: Login -> Dashboard
// Simulated Google Authenticator Routine
document.getElementById('loginBtn').addEventListener('click', function(event) {
    // Playing sound here unlocks mobile audio restrictions for the rest of the app session
    sound.play();
    

    // Request full screen mode for Android/Desktop browsers
    const docElm = document.documentElement;
    if (docElm.requestFullscreen) {
        docElm.requestFullscreen();
    } else if (docElm.webkitRequestFullscreen) { /* Safari support */
        docElm.webkitRequestFullscreen();
    }

    // Explicitly target the button via event.currentTarget to avoid scoping issues
    const btn = event.currentTarget;
    
    // Aesthetic structural button transformation sequence
    btn.innerHTML = '<span class="relative z-10 flex items-center gap-2"><span class="material-symbols-outlined animate-spin text-sm">autorenew</span> INITIATING SYNC...</span>';
    btn.style.opacity = '0.7';
    btn.style.pointerEvents = 'none';
    
    // Short latency buffer before state route change
    setTimeout(() => {
        navigateTo('dashboardScreen');
    }, 1500);
});

// Sound Triggers & Nav Routes
document.getElementById('triggerSoundBtn').addEventListener('click', () => {
    sound.play();
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
