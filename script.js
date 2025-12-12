let currentScene = 1;
const totalScenes = 7;

// Scene navigation
function goToScene(sceneNumber) {
    if (sceneNumber < 1 || sceneNumber > totalScenes) return;

    // Remove active class from current scene
    document.querySelector('.scene.active').classList.remove('active');

    // Add active class to new scene
    document.getElementById(`scene${sceneNumber}`).classList.add('active');

    // Update progress dots
    document.querySelectorAll('.dot').forEach(dot => dot.classList.remove('active'));
    document.querySelector(`.dot[data-scene="${sceneNumber}"]`).classList.add('active');

    // Update current scene
    currentScene = sceneNumber;

    // Update button states
    updateButtons();
}

function updateButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    prevBtn.disabled = currentScene === 1;
    nextBtn.disabled = currentScene === totalScenes;
}

// Event listeners
document.getElementById('prevBtn').addEventListener('click', () => {
    if (currentScene > 1) {
        goToScene(currentScene - 1);
    }
});

document.getElementById('nextBtn').addEventListener('click', () => {
    if (currentScene < totalScenes) {
        goToScene(currentScene + 1);
    }
});

// Dot navigation
document.querySelectorAll('.dot').forEach(dot => {
    dot.addEventListener('click', (e) => {
        const sceneNum = parseInt(e.target.dataset.scene);
        goToScene(sceneNum);
    });
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        if (currentScene > 1) goToScene(currentScene - 1);
    } else if (e.key === 'ArrowRight') {
        if (currentScene < totalScenes) goToScene(currentScene + 1);
    }
});

// Auto-advance (optional - comment out if not needed)
let autoAdvanceInterval;
let autoAdvanceEnabled = false;

function startAutoAdvance() {
    autoAdvanceEnabled = true;
    autoAdvanceInterval = setInterval(() => {
        if (currentScene < totalScenes) {
            goToScene(currentScene + 1);
        } else {
            goToScene(1); // Loop back to start
        }
    }, 5000); // 5 seconds per scene
}

function stopAutoAdvance() {
    autoAdvanceEnabled = false;
    clearInterval(autoAdvanceInterval);
}

// Optional: Start auto-advance after page load
// Uncomment the next line to enable auto-play
// setTimeout(startAutoAdvance, 2000);

// Stop auto-advance on user interaction
document.addEventListener('click', () => {
    if (autoAdvanceEnabled) {
        stopAutoAdvance();
    }
});

// Touch/swipe support for mobile
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    if (autoAdvanceEnabled) {
        stopAutoAdvance();
    }
});

document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe left - next scene
            if (currentScene < totalScenes) {
                goToScene(currentScene + 1);
            }
        } else {
            // Swipe right - previous scene
            if (currentScene > 1) {
                goToScene(currentScene - 1);
            }
        }
    }
}

// Create animated background particles (optional enhancement)
function createParticles() {
    const particleContainer = document.createElement('div');
    particleContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 0;
    `;

    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 4 + 1}px;
            height: ${Math.random() * 4 + 1}px;
            background: rgba(255, 255, 255, ${Math.random() * 0.5 + 0.2});
            border-radius: 50%;
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            animation: float ${Math.random() * 10 + 5}s linear infinite;
        `;
        particleContainer.appendChild(particle);
    }

    document.body.appendChild(particleContainer);
}

// Add floating animation CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes floatParticle {
        0%, 100% {
            transform: translateY(0) translateX(0);
        }
        25% {
            transform: translateY(-20px) translateX(10px);
        }
        50% {
            transform: translateY(-40px) translateX(-10px);
        }
        75% {
            transform: translateY(-20px) translateX(10px);
        }
    }
`;
document.head.appendChild(style);

// Initialize
updateButtons();
createParticles();

// Track analytics (optional - add your tracking code here)
function trackSceneView(sceneNumber) {
    // Example: Google Analytics
    // gtag('event', 'scene_view', { 'scene': sceneNumber });
    console.log(`Scene ${sceneNumber} viewed`);
}

// Track scene changes
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.target.classList.contains('active')) {
            trackSceneView(currentScene);
        }
    });
});

document.querySelectorAll('.scene').forEach(scene => {
    observer.observe(scene, { attributes: true, attributeFilter: ['class'] });
});

// Performance: Preload next scene content
function preloadNextScene() {
    if (currentScene < totalScenes) {
        const nextScene = document.getElementById(`scene${currentScene + 1}`);
        // Force browser to render next scene
        nextScene.style.willChange = 'transform, opacity';

        setTimeout(() => {
            nextScene.style.willChange = 'auto';
        }, 1000);
    }
}

// Preload on scene change
setInterval(preloadNextScene, 100);