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
document.getElementById('intro-title').textContent = `Happy Birthday ${CONFIG.name}! 🎉`;

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
const starEmojis = ['⭐', '✨', '🌟', '💫', '⭐', '✨', '🌟', '💫', '⭐', '✨'];
starEmojis.forEach((emoji, i) => {
    const star = document.createElement('div');
    star.className = 'star';
    star.textContent = emoji;
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    document.getElementById('intro-section').appendChild(star);

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

// Transition to cake on click
document.getElementById('intro-section').addEventListener('click', () => {
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
let micStream = null; // NEW: To store the stream for cleanup

// NEW: Select the audio element
const happyBirthdayAudio = document.getElementById('happyBirthdayAudio');

const cakeContainer = document.getElementById('cake-container');
const cakeImg = document.getElementById('cake-img');
const flameGlow = document.getElementById('flame-glow');
const blowInstruction = document.getElementById('blow-instruction');
const blowFallback = document.getElementById('blow-fallback');

cakeContainer.addEventListener('click', () => {
    if (!candleLit) {
        // Light the candle
        candleLit = true;
        
        // NEW: Play Audio with Fade-in
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
            micStream = stream; // NEW: Save stream to global variable
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

    // NEW: Stop the instrumental audio immediately
    if(happyBirthdayAudio) {
        happyBirthdayAudio.pause();
        happyBirthdayAudio.currentTime = 0;
    }

    // NEW: Completely stop microphone hardware access
    if (micStream) {
        micStream.getTracks().forEach(track => track.stop());
    }

    // Stop microphone processing
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

    // Play happy birthday song (Celebration version)
    const birthdaySong = new Howl({
        src: [CONFIG.audio.happyBirthday],
        volume: 0.5
    });
    birthdaySong.play();

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

                gsap.to('#envelope-container', {
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
const envelopeContainer = document.getElementById('envelope-container');

envelopeContainer.addEventListener('click', () => {
    gsap.to('#envelope-container', {
        rotateX: 180,
        scale: 0,
        duration: 0.8,
        ease: "power2.in"
    });

    setTimeout(() => {
        gsap.to('#envelope-section', {
            opacity: 0,
            duration: 0.8,
            onComplete: () => {
                document.getElementById('envelope-section').style.display = 'none';
                document.getElementById('cards-section').style.display = 'flex';
                
                gsap.to('#cards-section', {
                    opacity: 1,
                    duration: 1
                });

                // Animate cards in
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
    }, 500);
});

// ============================================
// CARDS SECTION
// ============================================

// Card 1: Flower
const cardFlower = document.getElementById('card-flower');
const flower = document.getElementById('flower');
const flowerMessage = document.getElementById('flower-message');

cardFlower.addEventListener('click', () => {
    if (!cardFlower.classList.contains('active')) {
        cardFlower.classList.add('active');
        
        gsap.to(flower, {
            scale: 1,
            rotation: 360,
            duration: 1.5,
            ease: "elastic.out(1, 0.5)"
        });

        typeWriter(flowerMessage, CONFIG.messages.flower);
    }
});

// Card 2: Message
const cardMessage = document.getElementById('card-message');
const specialMessage = document.getElementById('special-message');

cardMessage.addEventListener('click', () => {
    if (!cardMessage.classList.contains('active')) {
        cardMessage.classList.add('active');
        typeWriter(specialMessage, CONFIG.messages.special);
    }
});

// Card 3: Song
const cardSong = document.getElementById('card-song');
const playButton = document.getElementById('play-button');
const waveform = document.getElementById('waveform');

let songPlaying = false;
const song = new Howl({
    src: [CONFIG.audio.remindsOfYou],
    volume: 0.6,
    onend: () => {
        songPlaying = false;
        playButton.textContent = '▶';
        waveform.querySelectorAll('.wave-bar').forEach(bar => {
            bar.classList.remove('active');
        });
    }
});

cardSong.addEventListener('click', (e) => {
    if (!cardSong.classList.contains('active')) {
        cardSong.classList.add('active');
    }
});

playButton.addEventListener('click', (e) => {
    e.stopPropagation();
    
    if (songPlaying) {
        song.pause();
        playButton.textContent = '▶';
        waveform.querySelectorAll('.wave-bar').forEach(bar => {
            bar.classList.remove('active');
        });
    } else {
        song.play();
        playButton.textContent = '⏸';
        waveform.querySelectorAll('.wave-bar').forEach((bar, i) => {
            setTimeout(() => {
                bar.classList.add('active');
                bar.style.animationDelay = `${i * 0.1}s`;
            }, i * 50);
        });
    }
    
    songPlaying = !songPlaying;
});

// Card 4: Photos
const cardPhotos = document.getElementById('card-photos');
let swiperInitialized = false;

cardPhotos.addEventListener('click', () => {
    if (!cardPhotos.classList.contains('active')) {
        cardPhotos.classList.add('active');
        
        if (!swiperInitialized) {
            new Swiper('#photo-swiper', {
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true
                },
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev'
                },
                loop: true,
                effect: 'fade',
                speed: 600
            });
            swiperInitialized = true;
        }
    }
});

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