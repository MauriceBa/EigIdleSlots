// EigIdleSlots - Enhanced Features & Audio
function playSound(type) {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = ctx.createOscillator();
        const gain = ctx.createGain();
        
        oscillator.connect(gain);
        gain.connect(ctx.destination);
        
        switch(type) {
            case 'spin':
                oscillator.type = 'sawtooth';
                oscillator.frequency.value = 200;
                gain.gain.value = 0.2;
                oscillator.start();
                oscillator.stop(ctx.currentTime + 0.1);
                break;
            case 'win':
                oscillator.type = 'sine';
                oscillator.frequency.value = 440;
                gain.gain.value = 0.3;
                oscillator.start();
                oscillator.stop(ctx.currentTime + 0.3);
                break;
            case 'bonus':
                oscillator.type = 'triangle';
                oscillator.frequency.value = 660;
                gain.gain.value = 0.25;
                oscillator.start();
                oscillator.stop(ctx.currentTime + 0.5);
                break;
            case 'click':
                oscillator.type = 'sine';
                oscillator.frequency.value = 300;
                gain.gain.value = 0.15;
                oscillator.start();
                oscillator.stop(ctx.currentTime + 0.05);
                break;
        }
    } catch(e) {
        console.log('Audio not available');
    }
}

// Play sound on button clicks
document.addEventListener('click', function(e) {
    if (e.target.tagName === 'BUTTON') {
        playSound('click');
    }
});