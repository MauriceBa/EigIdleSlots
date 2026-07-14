// EigIdleSlots - Gambling Mini-Games

// Floating coin visual effect
function spawnFloatingCoins(count) {
    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            const coin = document.createElement('div');
            coin.className = 'coin-float';
            coin.textContent = '💰';
            coin.style.left = Math.random() * window.innerWidth + 'px';
            coin.style.animationDuration = (2 + Math.random() * 3) + 's';
            document.body.appendChild(coin);
            setTimeout(() => coin.remove(), 5000);
        }, i * 100);
    }
}

// Risk/Reward Double or Nothing
function riskDouble() {
    if (game.coins < 1000) {
        game.showNotification('1000 Coins für Risk Game! 🎲');
        return;
    }
    
    game.coins -= 1000;
    const win = Math.random() < 0.5;
    
    if (win) {
        game.coins += 2000;
        game.showNotification('GEWINN! +2000 Coins! 🎉');
    } else {
        game.showNotification('VERLOREN! -1000 Coins! 😢');
    }
    game.saveGame();
    game.updateUI();
}

// Coin Flip Mini-Game
function openCoinFlip() {
    if (game.coins < 500) {
        game.showNotification('500 Coins für Coin Flip! 🪙');
        return;
    }
    
    const modal = document.getElementById('modal-overlay');
    const content = document.getElementById('modal-content');
    
    content.innerHTML = `
        <h2>🪙 Münzwurf</h2>
        <p style="margin:20px 0;">Einsatz: 500 Coins - Verdopple deinen Gewinn!</p>
        <div id="coin-flip-display" style="font-size:5rem;margin:20px 0;">🪙</div>
        <button onclick="flipCoin()" style="padding:10px 20px;font-size:1rem;background:var(--primary);color:white;border:none;border-radius:5px;cursor:pointer;margin-right:10px;">WERTSEITE</button>
        <button onclick="flipCoin()" style="padding:10px 20px;font-size:1rem;background:var(--secondary);color:#000;border:none;border-radius:5px;cursor:pointer;">WEGESEITE</button>
        <p id="coin-result" style="margin-top:20px;color:var(--gold);"></p>
    `;
    modal.classList.remove('hidden');
}

function flipCoin() {
    const result = Math.random() < 0.5 ? 'Wert' : 'Weg';
    const win = result === 'Wert';
    const display = document.getElementById('coin-flip-display');
    const resultEl = document.getElementById('coin-result');
    
    display.textContent = win ? '👑' : '⭐';
    
    if (win) {
        game.coins += 1000;
        resultEl.textContent = `Gewonnen! ${result} - +1000 Coins!`;
    } else {
        resultEl.textContent = `Verloren! ${result} - Versuchs nochmal!`;
    }
    
    game.saveGame();
    game.updateUI();
    
    setTimeout(() => resultEl.textContent = '', 3000);
}

// Lucky Wheel (50/50 chance)
function openLuckyWheel() {
    if (game.coins < 2000) {
        game.showNotification('2000 Coins für Lucky Wheel! 🎯');
        return;
    }
    
    game.coins -= 2000;
    const win = Math.random() < 0.5;
    
    if (win) {
        const prize = Math.floor(Math.random() * 10000) + 5000;
        game.coins += prize;
        game.freeSpins += 5;
        game.showNotification(`Glückspiel gewonnen! +${prize} Coins & 5 Free Spins! 🎰`);
    } else {
        game.showNotification('Leider nicht geklickt! 😞');
    }
    game.saveGame();
    game.updateUI();
}