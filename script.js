// ============================================
// CONFIGURATION - EDIT THESE VALUES
// ============================================
const CONFIG = {
    name: "Boss",
    messages: {
        flower: "Like this flower, you bring beauty and joy to everyone around you. Happy Birthday! 🌸",
        special: "Another year older, another year wiser, and another year of being absolutely amazing! I'm so grateful to have you in my life. Here's to more adventures, laughter, and unforgettable moments together. You deserve all the happiness in the world! 🎉✨"
    },
    audio: {
        happyBirthday: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        remindsOfYou: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
    },
    photos: [
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='%234a90e2' width='400' height='300'/%3E%3Ctext x='200' y='150' font-size='24' fill='white' text-anchor='middle'%3EMemory 1%3C/text%3E%3C/svg%3E",
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='%23e74c3c' width='400' height='300'/%3E%3Ctext x='200' y='150' font-size='24' fill='white' text-anchor='middle'%3EMemory 2%3C/text%3E%3C/svg%3E",
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='%2350c878' width='400' height='300'/%3E%3Ctext x='200' y='150' font-size='24' fill='white' text-anchor='middle'%3EMemory 3%3C/text%3E%3C/svg%3E"
    ]
};

// ============================================
// INTRO SECTION
// ============================================
document.getElementById('intro-title').textContent = `Happy Birthday ${CONFIG.name}!🎉`;

// Note: You previously used 'cake-title' but that element isn't in your HTML snippet. 
// If you added it to index.html, this line works. If not, you can remove it or ignore the error.
// document.getElementById('cake-title').textContent = `Happy Birthday ${CONFIG.name}!❤️`;

// Confetti on load
confetti({
    particleCount: 150,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#ff6b9d', '#c44569', '#f0a500', '#ffd700', '#4a90e2']
});

// Balloons animation
const balloonEmojis = ['🎈', '🎈', '🎈', '🎈', '🎈', '🎈'];
balloonEmojis.forEach((emoji, i) => {
    const balloon = document.createElement('div');
    balloon.className = 'balloon';
    balloon.textContent = emoji;
    balloon.style.left = `${Math.random() * 100}%`;
    balloon.style.bottom = '-50px';
    document.getElementById('intro-section').appendChild(balloon);

    gsap.to(balloon, {
        y: -window.innerHeight - 100,
        opacity: 1,
        duration: 8 + Math.random() * 4,
        delay: i * 0.3,
        ease: "power1.inOut",
        repeat: -1,
        onRepeat: function() {
            balloon.style.left = `${Math.random() * 100}%`;
        }
    });
});

// Stars animation
const starEmojis = ['⭐', '✨', '🌟', '💫','🎉', '🍰', '🎂', '🍭', '🥳', '🎁', '🎊', '🧁'];
starEmojis.forEach((emoji, i) => {
    const star = document.createElement('div');
    star.className = 'star';
    star.textContent = emoji;
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    
    document.body.appendChild(star);

    gsap.to(star, {
        y: Math.random() * 100 - 50,
        x: Math.random() * 100 - 50,
        opacity: Math.random() * 0.5 + 0.5,
        scale: Math.random() * 0.5 + 0.8,
        duration: 3 + Math.random() * 2,
        delay: i * 0.2,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true
    });

    gsap.to(star, {
        rotation: 360,
        duration: 4 + Math.random() * 3,
        ease: "linear",
        repeat: -1
    });
});

// Transition to cake on click (Audio starts here)
document.getElementById('intro-section').addEventListener('click', () => {
    
    const happyBirthdayAudio = document.getElementById('happyBirthdayAudio');
    if (happyBirthdayAudio) {
        happyBirthdayAudio.currentTime = 0;
        happyBirthdayAudio.volume = 0;
        happyBirthdayAudio.play();

        // Fade in logic
        let vol = 0;
        const fadeInterval = setInterval(() => {
            if (vol < 1.0) {
                vol += 0.05;
                happyBirthdayAudio.volume = Math.min(vol, 1.0);
            } else {
                clearInterval(fadeInterval);
            }
        }, 100);
    }

    gsap.to('#intro-section', {
        opacity: 0,
        duration: 1,
        onComplete: () => {
            document.getElementById('intro-section').style.display = 'none';
            document.getElementById('cake-section').style.display = 'flex';
            
            gsap.to('#cake-container', {
                scale: 1,
                duration: 1,
                ease: "back.out(1.7)"
            });
        }
    });
});

// ============================================
// CAKE SECTION
// ============================================
let candleLit = false;
let audioContext;
let microphone;
let analyser;
let blowDetected = false;
let micStream = null; 

const happyBirthdayAudio = document.getElementById('happyBirthdayAudio');
const cakeContainer = document.getElementById('cake-container');
const cakeImg = document.getElementById('cake-img');
const flameGlow = document.getElementById('flame-glow');
const blowInstruction = document.getElementById('blow-instruction');
const blowFallback = document.getElementById('blow-fallback');

cakeContainer.addEventListener('click', () => {
    if (!candleLit) {
        candleLit = true;
        
        // Change to lit cake image
        cakeImg.src = 'images/cake_candle_on.png';
        
        // Show flame glow with animation
        flameGlow.classList.add('active');
        gsap.to(flameGlow, {
            opacity: 1,
            duration: 0.3
        });
        
        gsap.to(blowInstruction, {
            opacity: 1,
            duration: 0.5
        });

        // Request microphone permission
        requestMicrophone();
    }
});

function requestMicrophone() {
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            micStream = stream;
            setupAudioDetection(stream);
        })
        .catch(err => {
            console.log('Microphone access denied, showing fallback button');
            blowFallback.classList.remove('hidden');
            blowFallback.addEventListener('click', blowCandle);
        });
}

function setupAudioDetection(stream) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    microphone = audioContext.createMediaStreamSource(stream);
    analyser.fftSize = 256;
    
    microphone.connect(analyser);
    
    detectBlow();
}

function detectBlow() {
    if (blowDetected) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    function check() {
        if (blowDetected) return;

        analyser.getByteFrequencyData(dataArray);
        
        const average = dataArray.reduce((a, b) => a + b) / bufferLength;
        
        if (average > 50) {
            blowCandle();
        } else {
            requestAnimationFrame(check);
        }
    }

    check();
}

blowFallback.addEventListener('click', blowCandle);

function blowCandle() {
    if (blowDetected) return;
    blowDetected = true;

    // --- CONTINUOUS AUDIO UPDATE ---
    // We removed the code that stops the current song.
    // We removed the code that starts a new Howl song.
    // The intro song will just keep playing! 🎶
    
    // Completely stop microphone hardware access
    if (micStream) {
        micStream.getTracks().forEach(track => track.stop());
    }

    // Stop microphone processing context
    if (microphone) {
        microphone.disconnect();
        audioContext.close();
    }

    // Animate flame out
    gsap.to(flameGlow, {
        opacity: 0,
        scale: 0.5,
        duration: 0.4,
        ease: "power2.out",
        onComplete: () => {
            flameGlow.classList.remove('active');
        }
    });

    // Change to blown cake image
    setTimeout(() => {
        cakeImg.src = 'images/cake_candle_off.png';
    }, 200);

    // Spark confetti
    confetti({
        particleCount: 100,
        spread: 90,
        origin: { x: 0.5, y: 0.4 },
        colors: ['#ffd700', '#ff6b9d', '#4a90e2']
    });

    // Transition to envelope
    setTimeout(() => {
        gsap.to('#cake-section', {
            opacity: 0,
            duration: 1.5,
            onComplete: () => {
                document.getElementById('cake-section').style.display = 'none';
                document.getElementById('envelope-section').style.display = 'flex';
                
                gsap.to('#envelope-section', {
                    opacity: 1,
                    duration: 1
                });

                gsap.to('#envelope-container', { // Ensure ID matches your HTML (wrapper vs container)
                    scale: 1,
                    duration: 1,
                    delay: 0.5,
                    ease: "back.out(1.7)"
                });
            }
        });
    }, 2000);
}

// ============================================
// ENVELOPE SECTION
// ============================================
const envelopeWrapper = document.getElementById('envelope-wrapper');
const openSurprisesBtn = document.getElementById('open-surprises-btn');

envelopeWrapper.addEventListener('click', () => {
    // 1. Trigger Envelope Open Animation
    envelopeWrapper.classList.add('open');

    // 2. Wait for envelope to open (2.5s), then go to Letter View
    setTimeout(() => {
        gsap.to('#envelope-section', {
            opacity: 0,
            duration: 0.8,
            onComplete: () => {
                document.getElementById('envelope-section').style.display = 'none';
                
                // Show Letter Section
                const letterSection = document.getElementById('letter-view-section');
                letterSection.style.display = 'flex';
                
                // Animate Paper Popping In
                gsap.to(letterSection, { opacity: 1, duration: 0.5 });
                gsap.to('#paper-content', { 
                    scale: 1, 
                    opacity: 1, 
                    duration: 0.8, 
                    ease: "back.out(1.5)" 
                });
            }
        });
    }, 2500);
});

// 3. Handle 'See More' Button Click
openSurprisesBtn.addEventListener('click', () => {
    gsap.to('#letter-view-section', {
        opacity: 0,
        duration: 0.8,
        onComplete: () => {
            document.getElementById('letter-view-section').style.display = 'none';
            document.getElementById('cards-section').style.display = 'flex';
            
            // Fade in Cards Section
            gsap.to('#cards-section', {
                opacity: 1,
                duration: 1
            });

            // Pop up cards one by one
            const cards = document.querySelectorAll('.card');
            cards.forEach((card, i) => {
                gsap.to(card, {
                    scale: 1,
                    duration: 0.6,
                    delay: i * 0.2,
                    ease: "back.out(1.7)"
                });
            });
        }
    });
});

// ============================================
// CARDS SECTION
// ============================================

// Card 1: Virtual Bouquet
const cardFlower = document.getElementById('card-flower');
const flowerSection = document.getElementById('flower-view-section');
const closeFlowerBtn = document.getElementById('close-flower-btn');

if (cardFlower) {
    cardFlower.addEventListener('click', () => {
        flowerSection.style.display = 'flex';
        flowerSection.style.opacity = 0;

        gsap.to(flowerSection, {
            opacity: 1,
            duration: 0.5
        });

        // Pop the bouquet items up
        gsap.from('.tulip-item', {
            scale: 0,
            y: 100,
            rotation: 0,
            duration: 1.2,
            stagger: 0.1,
            ease: "elastic.out(1, 0.6)"
        });
        
        gsap.from('.bouquet-ribbon', {
            scale: 0,
            duration: 0.8,
            delay: 0.8,
            ease: "back.out(2)"
        });
    });
}

if (closeFlowerBtn) {
    closeFlowerBtn.addEventListener('click', () => {
        gsap.to(flowerSection, {
            opacity: 0,
            duration: 0.5,
            onComplete: () => {
                flowerSection.style.display = 'none';
            }
        });
    });
}

// Card 2: Photobooth Strip
const cardPhotos = document.getElementById('card-photos');
const memorySection = document.getElementById('memory-view-section');
const closeMemoryBtn = document.getElementById('close-memory-btn');

if (cardPhotos) {
    cardPhotos.addEventListener('click', () => {
        memorySection.style.display = 'flex';
        memorySection.style.opacity = 0;

        // Fade in background
        gsap.to(memorySection, {
            opacity: 1,
            duration: 0.5
        });

        // Animate the strip dropping down (Updated to handle multiple strips if present)
        gsap.from('.photobooth-strip', {
            y: -800, 
            opacity: 0,
            duration: 1.5,
            stagger: 0.3,
            ease: "elastic.out(1, 0.7)"
        });
    });
}

if (closeMemoryBtn) {
    closeMemoryBtn.addEventListener('click', () => {
        gsap.to(memorySection, {
            opacity: 0,
            duration: 0.5,
            onComplete: () => {
                memorySection.style.display = 'none';
            }
        });
    });
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// ============================================
// RESTART FUNCTION
// ============================================
const restartBtn = document.getElementById('restart-btn');

if (restartBtn) {
    restartBtn.addEventListener('click', () => {
        // Reloads the page to reset all animations and audio
        location.reload(); 
    });
}