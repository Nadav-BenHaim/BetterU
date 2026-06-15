// 1. Initialize the Audio Assets
// Place your audio file in the same folder as this script, or a subfolder like 'audio/'
const sound = new Howl({
    src: ['sound-effect.mp3'], 
    html5: true // Ensures better streaming performance on mobile devices
});
// Dashboard Track 1: Narrative Voiceover or Intro Sound
const dashboardIntroSound = new Howl({ 
    src: ['scene01_p02.mp3'], 
    html5: true 
});

// Dashboard Track 2: Sustained Ambient System Loop
const dashboardAmbientLoop = new Howl({ 
    src: ['scene01_p03.mp3'], 
    html5: true, 
    loop: true, 
    volume: 0.4 // Kept slightly quieter in background
});

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
    try { sound.play(); } catch(e) {}
    

    // Request full screen mode for Android/Desktop browsers
    const docElm = document.documentElement;
    if (docElm.requestFullscreen) {
        docElm.requestFullscreen();
    } else if (docElm.webkitRequestFullscreen) { /* Safari support */
        docElm.webkitRequestFullscreen();
    }
    
    // 3. Lock the scrolling system dynamically so subsequent screens don't scroll
    document.body.style.overflowY = 'hidden';
    document.body.style.height = '100dvh';

    // Explicitly target the button via event.currentTarget to avoid scoping issues
    const btn = event.currentTarget;
    
    // Aesthetic structural button transformation sequence
    btn.innerHTML = '<span class="relative z-10 flex items-center gap-2"><span class="material-symbols-outlined animate-spin text-sm">autorenew</span> INITIATING SYNC...</span>';
    btn.style.opacity = '0.7';
    btn.style.pointerEvents = 'none';
    
    // Short latency buffer before state route change
    setTimeout(() => {
        navigateTo('dashboardScreen');

        // Start the intro audio automatically as the dashboard appears
        try {
            dashboardIntroSound.play();
        } catch(err) {
            console.log("Audio autoplay prevented or missing, triggering bypass...", err);
            triggerAlertSequence(); // Fallback if mobile blocks it
        }
    }, 1500);
});

// 4. Sequential Dashboard Interface Timeline Triggers

// Runs when Intro track is completed
dashboardIntroSound.on('end', function() {
    triggerAlertSequence();
});

function triggerAlertSequence() {
    // A. Animate notification card onto viewport
    const container = document.getElementById('alertNotification');
    const card = container.querySelector('.glass-card');
    
    container.classList.remove('hidden');
    card.classList.add('notification-slide');
    
    // B. Spin up the ambient sound array loop now that the intro has cleared
    try {
        dashboardAmbientLoop.play();
    } catch(e) {}
}

/*
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
}); */

/*
// Subtle Ambient Canvas Mouse/Gyroscopic Response Track
document.addEventListener('mousemove', (e) => {
    const ring = document.querySelector('.loading-ring');
    if (ring && ring.offsetParent !== null) { // Only calculate if visible
        const moveX = (e.clientX - window.innerWidth / 2) / 50;
        const moveY = (e.clientY - window.innerHeight / 2) / 50;
        ring.style.transform = `translate(${moveX}px, ${moveY}px)`;
    }
}); */

// Screen 2 Alert Button: Routes to Settings without dropping ambient sound loop
document.getElementById('alertActionBtn').addEventListener('click', () => {
    navigateTo('settingsScreen');
    // Notice: dashboardAmbientLoop is NOT stopped, so it carries over seamlessly!
});

document.getElementById('backToDashBtn').addEventListener('click', () => {
    navigateTo('dashboardScreen');
});

// Dynamic volume listener linked to master output
document.getElementById('volumeSlider').addEventListener('input', (e) => {
    document.getElementById('volumeVal').textContent = `${e.target.value}%`;
    Howler.volume(e.target.value / 100);
});

// Bento Card Hover Spotlight Matrix Effects
document.addEventListener('mousemove', (e) => {
    const cards = document.querySelectorAll('.glass-card');
    cards.forEach(card => {
        if (card.offsetParent !== null) { // Active layout optimization check
            const rect = card.getBoundingClientRect();
            const localX = e.clientX - rect.left;
            const localY = e.clientY - rect.top;
            
            if (localX > 0 && localX < rect.width && localY > 0 && localY < rect.height) {
                card.style.borderColor = `rgba(189, 200, 209, 0.3)`;
            } else {
                card.style.borderColor = `rgba(255, 255, 255, 0.1)`;
            }
        }
    });
});
