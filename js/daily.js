// EigIdleSlots - Daily Bonus & Events
function claimDailyBonus() {
    const lastClaim = localStorage.getItem('eigidle_lastDaily');
    const today = new Date().toDateString();
    
    if (lastClaim === today) {
        game.showNotification('Heute schon abgeholt! Komm morgen wieder! 📅');
        return;
    }
    
    localStorage.setItem('eigidle_lastDaily', today);
    const bonus = 500 * (game.prestige + 1);
    game.coins += bonus;
    game.saveGame();
    game.updateUI();
    game.showNotification(`Täglicher Bonus: +${bonus} Coins! 🎁`);
}

// Daily bonus button
function addDailyButton() {
    const header = document.querySelector('header');
    const dailyBtn = document.createElement('button');
    dailyBtn.innerHTML = '🎁 Täglich Bonus';
    dailyBtn.style.cssText = 'position:absolute;top:20px;left:20px;padding:8px 12px;background:#ffd700;color:#000;border:none;border-radius:5px;cursor:pointer;font-weight:bold;';
    dailyBtn.onclick = claimDailyBonus;
    header.appendChild(dailyBtn);
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(addDailyButton, 1000);
});