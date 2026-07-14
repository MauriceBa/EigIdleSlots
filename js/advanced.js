// EigIdleSlots - Advanced Features v2

// Achievement System
const achievements = [
    { id: 'first_spin', name: 'Erster Schritt', desc: '1 Spin', icon: '🎯', check: (g) => g.totalSpins >= 1 },
    { id: 'hundred_spins', name: 'Erfahrener Spieler', desc: '100 Spins', icon: '🔧', check: (g) => g.totalSpins >= 100 },
    { id: 'big_win', name: 'Big Winner', desc: '5000 Coins Gewinn', icon: '💎', check: (g) => g.highestWin >= 5000 },
    { id: 'jackpot_winner', name: 'Jackpot Master', desc: 'Jackpot gewonnen', icon: '🌟', check: (g) => g.loadGame('jackpotWins') >= 1 },
    { id: 'prestige', name: 'Prestige', desc: 'Erster Prestige', icon: '🏆', check: (g) => g.prestige >= 1 },
    { id: 'level_50', name: 'Level 50', desc: 'Level 50 erreicht', icon: '⭐', check: (g) => g.level >= 50 }
];

// Quests System
const dailyQuests = [
    { id: 'spin_50', name: 'Spinnen', target: 50, reward: 1000, progress: 0 },
    { id: 'win_10', name: 'Gewinne', target: 10, reward: 2000, progress: 0 },
    { id: 'spend_5000', name: 'Investor', target: 5000, reward: 3000, progress: 0 }
];

// Lottery System
function openLottery() {
    if (game.coins < 500) {
        game.showNotification('500 Coins für Lottery! 🎟️');
        return;
    }
    
    game.coins -= 500;
    const modal = document.getElementById('modal-overlay');
    const content = document.getElementById('modal-content');
    
    content.innerHTML = `
        <h2>🎟️ Lottery</h2>
        <p>Wähle eine Nummer (0-9):</p>
        <div id="lottery-grid" style="display:grid;grid-template-columns:repeat(5,1fr);gap:10px;margin:20px 0;">
            ${[0,1,2,3,4,5,6,7,8,9].map(n => `<button onclick="playLottery(${n})" style="font-size:2rem;padding:20px;">${n}</button>`).join('')}
        </div>
        <p>Gewinn: 10.000 Coins wenn richtig!</p>
    `;
    modal.classList.remove('hidden');
    game.saveGame();
}

function playLottery(choice) {
    const winning = Math.floor(Math.random() * 10);
    const modal = document.getElementById('modal-overlay');
    
    if (choice === winning) {
        game.coins += 10000;
        game.showNotification(` JACKPOT! Richtig! 🎉`);
    } else {
        game.showNotification(`Leider falsch. Gewinner war: ${winning}`);
    }
    
    modal.classList.add('hidden');
    game.saveGame();
    game.updateUI();
}

// Coin Rain Event (every 30s random bonus)
setInterval(() => {
    if (Math.random() < 0.1) {
        const bonus = Math.floor(Math.random() * 500) + 100;
        game.coins += bonus;
        game.saveGame();
        game.updateUI();
        game.showNotification(`Coin Regen! +${bonus} Coins! 🌧️💰`);
    }
}, 30000);

// Statistics tracking for achievements
function checkAchievements() {
    const unlocked = JSON.parse(localStorage.getItem('eigidle_achievements') || '[]');
    
    achievements.forEach(a => {
        if (!unlocked.includes(a.id) && a.check(game)) {
            unlocked.push(a.id);
            localStorage.setItem('eigidle_achievements', JSON.stringify(unlocked));
            game.showNotification(`Erfolg: ${a.name}! ${a.icon}`);
        }
    });
}

// Export functions to global
window.openLottery = openLottery;