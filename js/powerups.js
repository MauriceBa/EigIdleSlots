// EigIdleSlots - Power-Ups & Special Events
function activatePowerUp(type) {
    switch(type) {
        case 'mega_win':
            // Next spin wins 5x
            localStorage.setItem('eigidle_powerup_mega_win', '5');
            game.showNotification('Mega Win aktiviert! Nächster Spin x5! ⚡');
            break;
        case 'free_spins_x10':
            game.freeSpins += 10;
            game.saveGame();
            game.updateUI();
            game.showNotification('+10 Free Spins aktiviert! 🎁');
            break;
        case 'instant_jackpot':
            game.jackpotProgress = 999;
            game.saveGame();
            game.updateUI();
            game.showNotification('Jackpot bereit zum Einlösen! 🎰');
            break;
    }
}

// Power-Up button in HTML
function addPowerUpButtons() {
    const bonusSection = document.getElementById('bonus-section');
    const powerUpHTML = `
        <div class="bonus-card" onclick="activatePowerUp('mega_win')">
            <h3>Mega Win</h3>
            <p>Nächster Spin x5</p>
            <button>Power-Up (10K)</button>
        </div>
        <div class="bonus-card" onclick="activatePowerUp('free_spins_x10')">
            <h3>Spins Pack</h3>
            <p>+10 Free Spins</p>
            <button>Power-Up (5K)</button>
        </div>
        <div class="bonus-card" onclick="activatePowerUp('instant_jackpot')">
            <h3>Jackpot Key</h3>
            <p>Sofortiger Jackpot</p>
            <button>Power-Up (15K)</button>
        </div>
    `;
    bonusSection.insertAdjacentHTML('beforeend', powerUpHTML);
}