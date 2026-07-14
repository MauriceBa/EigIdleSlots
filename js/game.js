// EigIdleSlots - Main Game Logic
class EigIdleSlots {
    constructor() {
        // Load saved data
        this.coins = this.loadGame('coins') || 1000;
        this.autoSpins = this.loadGame('autoSpins') || 0;
        this.level = this.loadGame('level') || 1;
        this.spinSpeed = this.loadGame('spinSpeed') || 500;
        this.totalSpins = this.loadGame('totalSpins') || 0;
        this.totalWins = this.loadGame('totalWins') || 0;
        this.highestWin = this.loadGame('highestWin') || 0;
        this.totalEarned = this.loadGame('totalEarned') || 0;
        this.prestige = this.loadGame('prestige') || 0;
        
        // Machine states
        this.machinesUnlocked = this.loadGame('machinesUnlocked') || 1;
        
        // Upgrades
        this.upgrades = {
            auto_clicker: this.loadGame('upgrade_auto_clicker') || 0,
            coin_multiplier: this.loadGame('upgrade_coin_multiplier') || 0,
            machine_speed: this.loadGame('upgrade_machine_speed') || 0,
            new_machine: this.loadGame('upgrade_new_machine') || 0
        };
        
        // Bonuses
        this.freeSpins = this.loadGame('freeSpins') || 0;
        this.jackpotProgress = this.loadGame('jackpotProgress') || 0;
        
        // Symbol definitions (Classic)
        this.symbols = [
            { name: 'cherry', img: 'cherries.png', value: 10, color: '#ff6b6b' },
            { name: 'lemon', img: 'lemon.png', value: 15, color: '#ffd93d' },
            { name: 'orange', img: 'melon.png', value: 20, color: '#ff9f1c' },
            { name: 'plum', img: 'heart.png', value: 25, color: '#ff6b6b' },
            { name: 'bell', img: 'bell.png', value: 50, color: '#ffd93d' },
            { name: 'bar', img: 'Bar1.png', value: 100, color: '#6c5ce7' },
            { name: 'seven', img: 'Lucky7_rainbow.png', value: 500, color: '#00d2d3' },
            { name: 'diamond', img: 'clover.png', value: 250, color: '#00d2d3' }
        ];
        
        // Fruit symbols
        this.fruitSymbols = [
            { name: 'cherry', img: 'fruits.png', value: 10, x: 0, color: '#ff6b6b' },
            { name: 'lemon', img: 'fruits.png', value: 15, x: -24, color: '#ffd93d' },
            { name: 'orange', img: 'fruits.png', value: 20, x: -48, color: '#ff9f1c' },
            { name: 'plum', img: 'fruits.png', value: 25, x: -72, color: '#ff6b6b' },
            { name: 'bell', img: 'fruits.png', value: 50, x: -96, color: '#ffd93d' },
            { name: 'seven', img: 'fruits.png', value: 100, x: -120, color: '#00d2d3' }
        ];
        
        // Lucky 7s symbols
        this.luckySymbols = [
            { name: 'lucky7', img: 'Lucky7_rainbow.png', value: 100, color: '#00d2d3' },
            { name: 'lucky7_alt', img: 'Lucky7.png', value: 150, color: '#00d2d3' },
            { name: 'horseshoe', img: 'horseshoe.png', value: 75, color: '#ffd93d' },
            { name: 'clover', img: 'clover.png', value: 50, color: '#2ecc71' }
        ];
        
        this.init();
    }
    
    init() {
        this.updateUI();
        this.startAutoSpins();
        this.startOfflineProgress();
        this.startCoinRain();
        setInterval(() => this.saveGame(), 30000);
        this.checkAchievements();
    }
    
    loadGame(key) {
        try {
            const val = localStorage.getItem(`eigidle_${key}`);
            return val ? JSON.parse(val) : null;
        } catch {
            return null;
        }
    }
    
    saveGame() {
        localStorage.setItem('eigidle_coins', this.coins);
        localStorage.setItem('eigidle_autoSpins', this.autoSpins);
        localStorage.setItem('eigidle_level', this.level);
        localStorage.setItem('eigidle_spinSpeed', this.spinSpeed);
        localStorage.setItem('eigidle_machinesUnlocked', this.machinesUnlocked);
        localStorage.setItem('eigidle_freeSpins', this.freeSpins);
        localStorage.setItem('eigidle_jackpotProgress', this.jackpotProgress);
        localStorage.setItem('eigidle_prestige', this.prestige);
        localStorage.setItem('eigidle_totalSpins', this.totalSpins);
        localStorage.setItem('eigidle_totalWins', this.totalWins);
        localStorage.setItem('eigidle_highestWin', this.highestWin);
        localStorage.setItem('eigidle_totalEarned', this.totalEarned);
        
        Object.entries(this.upgrades).forEach(([key, val]) => {
            localStorage.setItem(`eigidle_upgrade_${key}`, val);
        });
    }
    
    resetGame() {
        if (confirm('Wirklich zurücksetzen? Alle Fortschritte gehen verloren!')) {
            localStorage.clear();
            location.reload();
        }
    }
    
    getCoinMultiplier() {
        return (1 + (this.upgrades.coin_multiplier * 0.25)) * Math.pow(2, this.prestige);
    }
    
    getUpgradePrice(upgrade) {
        const basePrices = {
            auto_clicker: 100,
            coin_multiplier: 500,
            machine_speed: 1000,
            new_machine: 5000
        };
        const multipliers = {
            auto_clicker: 1.5,
            coin_multiplier: 2,
            machine_speed: 1.8,
            new_machine: 3
        };
        return Math.floor(basePrices[upgrade] * Math.pow(multipliers[upgrade], this.upgrades[upgrade]));
    }
    
    buyUpgrade(upgrade) {
        const price = this.getUpgradePrice(upgrade);
        if (this.coins >= price) {
            this.coins -= price;
            this.upgrades[upgrade] += 1;
            
            switch(upgrade) {
                case 'auto_clicker':
                    this.autoSpins += 1;
                    this.showNotification('Auto-Spinner gekauft! +1/s ⚡');
                    break;
                case 'coin_multiplier':
                    this.showNotification('Coin Multiplier erhöht! +25% 💰');
                    break;
                case 'machine_speed':
                    this.spinSpeed = Math.max(200, this.spinSpeed * 0.9);
                    this.showNotification('Spin Speed verbessert! ⚡');
                    break;
                case 'new_machine':
                    this.machinesUnlocked = Math.min(3, this.machinesUnlocked + 1);
                    this.unlockMachines();
                    this.showNotification('Neue Maschine freigeschaltet! 🎰');
                    break;
            }
            
            this.saveGame();
            this.updateUI();
        } else {
            this.showNotification('Nicht genug Coins! 💸');
        }
    }
    
    unlockMachines() {
        for (let i = 2; i <= 3; i++) {
            const machineEl = document.querySelector(`[data-machine="${i}"]`);
            const btn = machineEl?.querySelector('.spin-btn');
            if (i <= this.machinesUnlocked && machineEl) {
                machineEl.classList.remove('locked');
                const h3 = machineEl.querySelector('h3');
                if (h3) {
                    const spans = h3.querySelectorAll('span');
                    spans.forEach(s => s.remove());
                    h3.textContent = i === 2 ? 'Fruit Slots 🍒' : 'Lucky 7s 🍀';
                }
                if (btn) {
                    btn.disabled = false;
                    btn.textContent = i === 2 ? 'SPIN (20💰)' : 'SPIN (50💰)';
                }
            }
        }
    }
    
    spinMachine(machineId) {
        if (machineId > this.machinesUnlocked) {
            this.showNotification('Maschine nicht freigeschaltet! 🔒');
            return;
        }
        
        const spinCost = machineId * 10;
        if (this.coins < spinCost) {
            this.showNotification('Nicht genug Coins! 💸');
            return;
        }
        
        this.coins -= spinCost;
        this.totalSpins += 1;
        
        let symbolSet;
        switch(machineId) {
            case 1: symbolSet = this.symbols; break;
            case 2: symbolSet = this.fruitSymbols; break;
            case 3: symbolSet = this.luckySymbols; break;
            default: symbolSet = this.symbols;
        }
        
        const reels = [1, 2, 3];
        const originalSymbols = [];
        
        // Store original symbols and start spinning
        reels.forEach(reelNum => {
            const reelEl = document.getElementById(`reel${reelNum}-${machineId}`);
            originalSymbols.push(reelEl.innerHTML);
            reelEl.classList.add('spinning');
            reelEl.dataset.original = originalSymbols[reelNum - 1];
        });
        
        // Add winning effect to machine
        const machine = document.querySelector(`[data-machine="${machineId}"]`);
        machine.classList.add('winning');
        
        // Stagger reel stopping
        const stopTimes = [0.5, 1.0, 1.5].map(t => t * this.spinSpeed / 500);
        
        reels.forEach((reelNum, index) => {
            setTimeout(() => {
                const reelEl = document.getElementById(`reel${reelNum}-${machineId}`);
                reelEl.classList.remove('spinning');
                
                // Show random symbol during spin
                const results = [
                    symbolSet[Math.floor(Math.random() * symbolSet.length)],
                    symbolSet[Math.floor(Math.random() * symbolSet.length)],
                    symbolSet[Math.floor(Math.random() * symbolSet.length)]
                ];
                
                const symbol = results[index];
                if (symbol.x !== undefined) {
                    reelEl.innerHTML = `<div style="width:80px;height:80px;background:url(assets/sprites/fruits.png);background-position:${symbol.x}px 0;"></div>`;
                } else {
                    reelEl.innerHTML = `<img src="assets/sprites/${symbol.img}" alt="${symbol.name}">`;
                }
            }, stopTimes[index]);
        });
        
        // Final result after all reels stopped
        setTimeout(() => {
            machine.classList.remove('winning');
            
            const results = [
                symbolSet[Math.floor(Math.random() * symbolSet.length)],
                symbolSet[Math.floor(Math.random() * symbolSet.length)],
                symbolSet[Math.floor(Math.random() * symbolSet.length)]
            ];
            
            results.forEach((symbol, i) => {
                const reelEl = document.getElementById(`reel${i+1}-${machineId}`);
                if (symbol.x !== undefined) {
                    reelEl.innerHTML = `<div style="width:80px;height:80px;background:url(assets/sprites/fruits.png);background-position:${symbol.x}px 0;"></div>`;
                } else {
                    reelEl.innerHTML = `<img src="assets/sprites/${symbol.img}" alt="${symbol.name}">`;
                }
            });
            
            const win = this.calculateWin(results);
            if (win > 0) {
                this.coins += win * this.getCoinMultiplier();
                this.totalWins += 1;
                this.highestWin = Math.max(this.highestWin, win);
                this.totalEarned += win;
                this.jackpotProgress += win;
                
                if (win >= 1000) {
                    this.freeSpins += 3;
                    spawnFloatingCoins(10);
                    this.showNotification(`BIG WIN! +${win} Coins & Free Spins! 🎁🎉`);
                } else {
                    this.showNotification(`Gewonnen! +${win} Coins! 🎉`);
                }
                
                const payline = document.querySelector(`[data-machine="${machineId}"] .payline`);
                payline.classList.add('active');
                setTimeout(() => payline.classList.remove('active'), 1000);
            } else {
                this.jackpotProgress += 5;
            }
            
            this.updateUI();
            this.checkAchievements();
            this.saveGame();
        }, this.spinSpeed);
    }
    
    calculateWin(results) {
        const symbolValues = results.map(s => s.value);
        const isWin = results.every(s => s.name === results[0].name);
        
        if (isWin) {
            return symbolValues.reduce((a, b) => a + b, 0) * 10;
        }
        
        const unique = [...new Set(results.map(s => s.name))];
        if (unique.length === 2) {
            return symbolValues.reduce((a, b) => a + b, 0) * 2;
        }
        
        return 0;
    }
    
    useFreeSpins() {
        if (this.freeSpins > 0) {
            this.freeSpins--;
            const randomMachine = Math.floor(Math.random() * this.machinesUnlocked) + 1;
            this.spinMachine(randomMachine);
            this.showNotification(`Free Spin auf Maschine ${randomMachine}! 🎰`);
            this.saveGame();
            this.updateUI();
        } else {
            this.showNotification('Keine Free Spins mehr! 😞');
        }
    }
    
    activateJackpot() {
        const target = 100;
        if (this.jackpotProgress >= target) {
            const win = (this.jackpotProgress) * 50;
            this.coins += win;
            this.jackpotProgress = 0;
            this.showNotification(`JACKPOT! +${win} Coins! 🎰💰`);
        } else {
            this.showNotification(`Noch ${target - this.jackpotProgress} benötigt!`);
        }
        this.saveGame();
        this.updateUI();
    }
    
    startAutoSpins() {
        setInterval(() => {
            if (this.autoSpins > 0 && this.coins >= 10) {
                const randomMachine = Math.floor(Math.random() * this.machinesUnlocked) + 1;
                this.spinMachine(randomMachine);
            }
        }, 1000);
    }
    
    startOfflineProgress() {
        const lastTime = this.loadGame('lastTime');
        if (lastTime) {
            const offlineTime = Date.now() - lastTime;
            const offlineSpins = Math.floor(offlineTime / 1000) * this.autoSpins;
            if (offlineSpins > 0) {
                this.coins += offlineSpins * 5;
                this.showNotification(`${offlineSpins} Offline Spins! +${offlineSpins * 5} Coins! ⏱️`);
            }
        }
        localStorage.setItem('eigidle_lastTime', Date.now());
    }
    
    startCoinRain() {
        // Random coin bonus every 30-60 seconds
        setInterval(() => {
            if (Math.random() < 0.2) {
                const bonus = Math.floor(Math.random() * 500) + 100;
                this.coins += bonus;
                this.showNotification(`Coin Regen! +${bonus} Coins! 🌧️💰`);
                this.updateUI();
            }
        }, 45000);
    }
    
    openWheelGame() {
        if (this.coins < 1000) {
            this.showNotification('1,000 Coins benötigt! 💰');
            return;
        }
        
        this.coins -= 1000;
        const modal = document.getElementById('modal-overlay');
        const content = document.getElementById('modal-content');
        
        content.innerHTML = `
            <h2>🎡 Glücksrad</h2>
            <div style="position:relative;width:250px;height:250px;margin:20px auto;">
                <svg id="wheel-svg" width="250" height="250"></svg>
                <div style="position:absolute;top:0;left:50%;transform:translateX(-50%);width:0;height:0;border-left:15px solid transparent;border-right:15px solid transparent;border-top:30px solid var(--gold);"></div>
            </div>
            <button onclick="game.spinWheel()" style="padding:10px 20px;font-size:1rem;background:var(--primary);color:white;border:none;border-radius:5px;cursor:pointer;">DREHEN</button>
        `;
        
        this.drawWheel();
        modal.classList.remove('hidden');
        this.saveGame();
    }
    
    drawWheel() {
        const segments = [
            { label: '500', value: 500, color: '#ff6b6b' },
            { label: '1K', value: 1000, color: '#4ecdc4' },
            { label: '2K', value: 2000, color: '#45b7d1' },
            { label: '5K', value: 5000, color: '#f9ca24' },
            { label: '10K', value: 10000, color: '#6c5ce7' },
            { label: '50K', value: 50000, color: '#fd79a8' },
            { label: '100K', value: 100000, color: '#00d2d3' },
            { label: 'x2', value: -1, color: '#2ecc71' }
        ];
        
        const svg = document.getElementById('wheel-svg');
        const centerX = 125;
        const centerY = 125;
        const radius = 110;
        
        svg.innerHTML = '';
        
        segments.forEach((segment, i) => {
            const angle = (i * 360) / segments.length;
            const x1 = centerX + radius * Math.cos(angle * Math.PI / 180);
            const y1 = centerY + radius * Math.sin(angle * Math.PI / 180);
            const x2 = centerX + radius * Math.cos((angle + 45) * Math.PI / 180);
            const y2 = centerY + radius * Math.sin((angle + 45) * Math.PI / 180);
            
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z`);
            path.setAttribute('fill', segment.color);
            path.setAttribute('stroke', '#fff');
            svg.appendChild(path);
        });
        
        svg.style.transformOrigin = 'center';
        svg.style.transform = 'rotate(0deg)';
    }
    
    spinWheel() {
        const segments = [500, 1000, 2000, 5000, 10000, 50000, 100000, -1];
        const win = segments[Math.floor(Math.random() * segments.length)];
        
        if (win === -1) {
            this.coins *= 2;
            this.showNotification(`Doppelte Coins! 💰💰`);
        } else {
            this.coins += win;
            this.showNotification(`Glücksrad: ${win.toLocaleString()} Coins gewonnen! 🎉`);
        }
        
        const modal = document.getElementById('modal-overlay');
        modal.classList.add('hidden');
        this.saveGame();
        this.updateUI();
    }
    
    openPrestige() {
        const modal = document.getElementById('modal-overlay');
        const content = document.getElementById('modal-content');
        
        content.innerHTML = `
            <h2>🌟 Prestige Reset</h2>
            <p style="margin:20px 0;font-size:1.2rem;">Reset alle Fortschritte für permanenten Bonus!</p>
            <p style="color:var(--gold);margin-bottom:20px;">Aktuell: ${this.prestige} Prestige Stufen<br>
            Nächste Stufe gibt: ${(Math.pow(2, this.prestige + 1)).toFixed(1)}x Coin Earnings</p>
            <button onclick="game.doPrestige()" style="padding:10px 20px;font-size:1rem;background:var(--primary);color:white;border:none;border-radius:5px;cursor:pointer;">PRESTIGE RESET</button>
        `;
        
        modal.classList.remove('hidden');
    }
    
    doPrestige() {
        if (this.coins < 10000) {
            this.showNotification('Mindestens 10,000 Coins für Prestige! 💰');
            closeModal();
            return;
        }
        
        this.prestige += 1;
        this.coins = 1000;
        this.autoSpins = 0;
        this.machinesUnlocked = 1;
        this.upgrades = { auto_clicker: 0, coin_multiplier: 0, machine_speed: 0, new_machine: 0 };
        this.freeSpins = 0;
        this.jackpotProgress = 0;
        this.totalSpins = 0;
        this.totalWins = 0;
        this.highestWin = 0;
        
        this.showNotification(`Prestige ${this.prestige}! +${(Math.pow(2, this.prestige)).toFixed(1)}x Coins! 🌟`);
        closeModal();
        this.saveGame();
        this.updateUI();
    }
    
    checkAchievements() {
        if (this.highestWin >= 5000 && !this.loadGame('achievement_bigwin')) {
            localStorage.setItem('eigidle_achievement_bigwin', true);
            this.showNotification('Erfolg: Big Winner! 💎');
        }
        
        const newLevel = Math.floor(this.coins / 10000) + 1 + this.prestige;
        this.level = newLevel;
    }
    
    updateUI() {
        document.getElementById('coins').textContent = Math.floor(this.coins).toLocaleString();
        document.getElementById('auto-spins').textContent = this.autoSpins;
        document.getElementById('level').textContent = this.level;
        document.getElementById('free-spins').textContent = this.freeSpins;
        document.getElementById('jackpot-progress').textContent = this.jackpotProgress;
        document.getElementById('total-spins').textContent = this.totalSpins;
        document.getElementById('win-rate').textContent = this.totalSpins > 0 ? Math.floor((this.totalWins / this.totalSpins) * 100) + '%' : '0%';
        document.getElementById('highest-win').textContent = this.highestWin.toLocaleString();
        document.getElementById('total-earned').textContent = this.totalEarned.toLocaleString();
        document.getElementById('prestige-level').textContent = this.prestige;
        document.getElementById('unlocked-machines').textContent = this.machinesUnlocked;
        
        document.getElementById('price-auto_clicker').textContent = this.getUpgradePrice('auto_clicker').toLocaleString();
        document.getElementById('owned-auto_clicker').textContent = this.upgrades.auto_clicker;
        document.getElementById('price-coin_multiplier').textContent = this.getUpgradePrice('coin_multiplier').toLocaleString();
        document.getElementById('owned-coin_multiplier').textContent = this.upgrades.coin_multiplier;
        document.getElementById('price-machine_speed').textContent = this.getUpgradePrice('machine_speed').toLocaleString();
        document.getElementById('owned-machine_speed').textContent = this.upgrades.machine_speed;
        document.getElementById('price-new_machine').textContent = this.getUpgradePrice('new_machine').toLocaleString();
        document.getElementById('owned-new_machine').textContent = this.upgrades.new_machine;
    }
    
    showNotification(text) {
        const notif = document.createElement('div');
        notif.className = 'notification';
        notif.textContent = text;
        document.body.appendChild(notif);
        setTimeout(() => notif.remove(), 3000);
    }
}

// Global functions
let game;

function spinMachine(id) { game.spinMachine(id); }
function buyUpgrade(upgrade) { game.buyUpgrade(upgrade); }
function activateFreeSpins() { game.useFreeSpins(); }
function activateJackpot() { game.activateJackpot(); }
function openWheelGame() { game.openWheelGame(); }
function openPrestige() { game.openPrestige(); }
function closeModal() { document.getElementById('modal-overlay').classList.add('hidden'); }
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
        <p style="margin:20px 0;">Wähle eine Nummer (0-9):</p>
        <div id="lottery-grid">
            ${[0,1,2,3,4,5,6,7,8,9].map(n => `<button onclick="playLottery(${n})">${n}</button>`).join('')}
        </div>
        <p style="color:var(--gold);margin-top:15px;">Gewinn: 10.000 Coins wenn richtig!</p>
    `;
    modal.classList.remove('hidden');
    game.saveGame();
}

function playLottery(choice) {
    const winning = Math.floor(Math.random() * 10);
    if (choice === winning) {
        game.coins += 10000;
        game.showNotification(`JACKPOT! Richtig! 🎉`);
    } else {
        game.showNotification(`Falsch! Gewinner war: ${winning}`);
    }
    closeModal();
    game.saveGame();
    game.updateUI();
}

window.onload = () => {
    game = new EigIdleSlots();
    game.unlockMachines();
};