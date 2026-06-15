// 1. Initialize the Audio Assets
// Place your audio file in the same folder as this script, or a subfolder like 'audio/'
const sound = new Howl({
    src: ['sound-effect.mp3'], 
    html5: true // Ensures better streaming performance on mobile devices
});
// Dashboard Track 1: Narrative Voiceover or Intro Sound
const dashboardIntroSound = new Howl({ 
    src: ['sound-effect.mp3'], //'scene01_p02.mp3'
    html5: true 
});
// Dashboard Track 2: Sustained Ambient System Loop
const popChatIntro = new Howl({ 
    src: ['scene01_p03.mp3'], 
    html5: true, 
    //loop: true, 
    //volume: 0.4 // Kept slightly quieter in background
});
//
const buttonSound = new Howl({ src: ['button-8.mp3'], html5: true });
const sendSound = new Howl({ src: ['message-sent.wav'], html5: true });
const errorSound = new Howl({ src: ['./audio/error_01.wav'], html5: true });

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
    try { buttonSound.play(); } catch(e) {}
    

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
        popChatIntro.play();
    } catch(e) {}
}

// 2. Map Dashboard button to transition directly into the Chat screen
document.getElementById('alertActionBtn').addEventListener('click', () => {
    navigateTo('chatScreen');
    // Notice: popChatIntro is NOT stopped, so it carries over seamlessly!
    
    // Release the dynamic vertical scrolling lock *only* for the chat log container
    document.body.style.overflowY = 'hidden';
    
});

// 3. Intercept Selection Logic Engine
document.querySelectorAll('.override-choice-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        const selectedText = e.currentTarget.getAttribute('data-message');
        
        // A. Immediately isolate inputs to block double-taps
        document.getElementById('keyboardOverridePanel').style.pointerEvents = 'none';
        document.getElementById('keyboardOverridePanel').style.opacity = '0.5';
        
        // B. Play outgoing transmission effect
        try { sendSound.play(); } catch(err) {}
        
        // C. Render genuine looking WhatsApp user reply bubble inside target container
        const targetContainer = document.getElementById('chatAppendTarget');
        const userBubble = document.createElement('div');
        userBubble.className = "max-w-[75%] bg-[#005c4b] text-[#e9edef] text-[15px] p-2.5 rounded-lg rounded-tr-none self-end shadow-sm relative mb-2 align-self-end ml-auto";
        userBubble.innerHTML = `
            ${selectedText}
            <span class="block text-[10px] text-[#a6d1c9] text-right mt-1">
                8:56 PM <span class="ml-1 text-[12px] font-bold">✓✓</span>
            </span>
        `;
        targetContainer.appendChild(userBubble);
        
        // D. Automatically roll down window view to focus on the message bubble
        userBubble.scrollIntoView({ behavior: 'smooth' });
        
        // E. Artificial delay before returning to system settings panel
        setTimeout(() => {
            navigateTo('settingsScreen');
        }, 2200);
    });
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
