/*
TODO - the page does not yet have a PROFILE button. Only login/register
dropdown menu that opens when the user clicks in the profile.
It references two HTML elements
*/
// textContent returns the text inside the element
// document is an object provided by the browser. It represents the entire HTML page that is currently loaded
// document.querySelectorAll() is a method that searches the HTML page and returns all elements that match a CSS selector.

const avatarBtn = document.getElementById('avatarBtn');
const dropdown = document.getElementById('dropdown');
// if these two elements exist, add event listeners
if (avatarBtn && dropdown) {
    avatarBtn.addEventListener('click', () => {
        const isOpen = dropdown.classList.toggle('open');
        avatarBtn.setAttribute('aria-expanded', isOpen);
    });
    document.addEventListener('click', (e) => {
        if (!avatarBtn.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.classList.remove('open');
            avatarBtn.setAttribute('aria-expanded', false);
        }
    });
}

// ── State ──
let balance = 1000;
const PAYOUT = 1.85;

const fakePrices = {
    BTC: { price: 67423.51, high: 68100.00, low: 66800.00, volume: '24.3B' },
    ETH: { price: 3512.88, high: 3580.00, low: 3440.00, volume: '9.1B' },
    SOL: { price: 172.44, high: 178.00, low: 169.00, volume: '2.8B' },
    BNB: { price: 608.30, high: 615.00, low: 601.00, volume: '1.2B' },
    XRP: { price: 0.5821, high: 0.5950, low: 0.5700, volume: '4.5B' },
};

// create an object "current prices" that stores the price of each Coin
let currentPrices = {};
for (const coin in fakePrices) currentPrices[coin] = fakePrices[coin].price;

let selectedCoin = 'BTC';
let cycleSecond = 0;
let bets = [];

const WINDOW = 15;
const MINUTE = 60;

// Grab this element from the HTML file, so I can control it
const priceCoin       = document.getElementById('priceCoin');
const priceValue      = document.getElementById('priceValue');
const priceChange     = document.getElementById('priceChange');
const stat24hHigh     = document.getElementById('stat24hHigh');
const stat24hLow      = document.getElementById('stat24hLow');
const statVolume      = document.getElementById('statVolume');
const timerLabel      = document.getElementById('timerLabel');
const timerBar        = document.getElementById('timerBar');
const timerCountdown  = document.getElementById('timerCountdown');
const betUp           = document.getElementById('betUp');
const betDown         = document.getElementById('betDown');
const betStatus       = document.getElementById('betStatus');
const betAmountInput  = document.getElementById('betAmount');
const payoutWin       = document.getElementById('payoutWin');
const navBalance      = document.getElementById('navBalance');
const historyList     = document.getElementById('historyList');
const activeBetsList  = document.getElementById('activeBetsList');
const toast           = document.getElementById('toast');

// ── Helpers ──
// toLocaleString builtin JS function to format numbers according to a country's conventions
function fmt(price) {
    return '$' + price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 });
}

// converts seconds into clock time. Ex: 75secs = 1
function formatTime(s) {
    return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
}

// TODELETE: random number generator to simulate the market
function randomMove(price) {
    return price * (1 + (Math.random() - 0.5) * 0.002);
}

// updates the balance
function updateBalance(amount) {
    balance += amount;
    if (balance < 0)
        balance = 0;
    navBalance.textContent = balance.toLocaleString('en-US', { minimumFractionDigits: 0 }) + ' T$';
}

// small temporary message that says if you won or lost
function showToast(msg, type) {
    toast.textContent = msg;
    toast.className = 'toast ' + type + ' show';
    setTimeout(() => { toast.className = 'toast'; }, 3500);
}

// "amt" becomes either the value of the bet or 0
// updates the payout display in case the user changes the bet value. Ex: bet=100 -> payout=185. User changes bet=200 -> payout 370
function updatePayoutDisplay() {
    const amt = parseFloat(betAmountInput.value) || 0;
    payoutWin.textContent = 'T$ ' + Math.floor(amt * PAYOUT).toLocaleString();
}

// updates everything that depends on the coin
function updatePriceDisplay(coin) {
    const price = currentPrices[coin];
    const data = fakePrices[coin];
    priceCoin.textContent = coin;
    priceValue.textContent = fmt(price);

    const changePct = ((price - fakePrices[coin].price) / fakePrices[coin].price * 100);
    const sign = changePct >= 0 ? '+' : '';
    priceChange.textContent = sign + changePct.toFixed(2) + '%';
    priceChange.className = 'price-change ' + (changePct >= 0 ? 'up' : 'down');
    stat24hHigh.textContent = fmt(data.high);
    stat24hLow.textContent = fmt(data.low);
    statVolume.textContent = data.volume;
}

// Adds click handlers to the quick amount buttons to automatically
// fill the bet input with a preset amount and recalculate the payout.
document.querySelectorAll('.coin-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.coin-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedCoin = btn.dataset.coin;
        updatePriceDisplay(selectedCoin);
    });
});

// ── Quick amounts ──
document.querySelectorAll('.quick-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const val = btn.dataset.amount;
        betAmountInput.value = val === 'max' ? Math.floor(balance) : val;
        updatePayoutDisplay();
    });
});

// Updates the payout whenever the user changes the bet amount.
betAmountInput.addEventListener('input', updatePayoutDisplay);

// Side panel showing the active bets
// activeBetsList.innerHTML = '' -> clears the displayed bets before redrawing
function renderActiveBets() {
    activeBetsList.innerHTML = '';
    const activeBets = bets.filter(bet => bet.status === 'active' || bet.status === 'queued');
    if (activeBets.length === 0) return;

    for (const bet of activeBets) {
        const card = document.createElement('div');
        card.className = 'active-bet-card';
        card.innerHTML = `
            <div class="side-panel-title">
                ${bet.status === 'queued' ? 'Queued Bet' : 'Active Bet'}
            </div>
            <div class="active-bet-row">
                <span class="active-bet-label">Coin</span>
                <span class="active-bet-value">${bet.coin}</span>
            </div>
            <div class="active-bet-row">
                <span class="active-bet-label">Direction</span>
                <span class="active-bet-value ${bet.direction}">${bet.direction.toUpperCase()}</span>
            </div>
            <div class="active-bet-row">
                <span class="active-bet-label">Entry price</span>
                <span class="active-bet-value">${bet.entry ? fmt(bet.entry) : '--'}</span>
            </div>
            <div class="active-bet-row">
                <span class="active-bet-label">Amount</span>
                <span class="active-bet-value">T$ ${bet.amount.toLocaleString()}</span>
            </div>
            <div class="active-bet-row">
                <span class="active-bet-label">Potential win</span>
                <span class="active-bet-value up">T$ ${Math.floor(bet.amount * PAYOUT).toLocaleString()}</span>
            </div>
        `;
        activeBetsList.appendChild(card);
    }
}

// This function records a finished bet in the history panel
function addHistory(coin, direction, entryPrice, exitPrice, amount, won) {
    const empty = historyList.querySelector('.history-empty');
    if (empty) empty.remove();

    const diff = ((exitPrice - entryPrice) / entryPrice * 100);
    const sign = diff >= 0 ? '+' : '';
    const payout = won ? '+T$ ' + Math.floor(amount * PAYOUT) : '-T$ ' + amount;

    const item = document.createElement('div');
    item.className = 'history-item';
    item.innerHTML = `<div class="history-left">
            <span class="history-coin">${coin}</span>
            <span class="history-direction ${direction}">${direction.toUpperCase()}</span>
            <span class="history-move">${sign}${diff.toFixed(3)}%</span>
        </div>
        <span class="history-result ${won ? 'win' : 'loss'}">${payout}</span>`;
    historyList.insertBefore(item, historyList.firstChild);
    // Keep max 8 items
    const items = historyList.querySelectorAll('.history-item');
    if (items.length > 8) items[items.length - 1].remove();
}

// This function decides whether the player won or lost
function resolveBet(direction, coin, entry, exit, amount) {
    const wentUp = exit > entry;
    const won = (direction === 'up' && wentUp) || (direction === 'down' && !wentUp);

    const diff = ((exit - entry) / entry * 100).toFixed(3);
    const sign = wentUp ? '+' : '';

    if (won) {
        const payout = Math.floor(amount * PAYOUT);
        updateBalance(payout);
        showToast(`✓ WIN ${coin} +T$ ${payout}`, 'win');
    }
    else {
        showToast(`✗ LOSS ${coin} -T$ ${amount}`, 'loss');
    }

    addHistory(coin, direction, entry, exit, amount, won);

    betStatus.textContent = `${coin} ${won ? 'WIN' : 'LOSS'} (${sign}${diff}%)`;
    betStatus.className = 'bet-status active ' + (won ? 'up' : 'down');
}

// Creates a new bet when the user clicks UP or DOWN
function placeBet(direction) {
    const amount = parseInt(betAmountInput.value) || 100;

    if (amount > balance) {
        betStatus.textContent = 'Insufficient balance';
        betStatus.className = 'bet-status active down';
        return;
    }
    updateBalance(-amount);
    const isQueued = cycleSecond >= WINDOW;
    const bet = {
        coin: selectedCoin,
        direction,
        amount,
        entry: isQueued ? null : currentPrices[selectedCoin],
        status: isQueued ? 'queued' : 'active'
    };
    bets.push(bet);
    renderActiveBets();
    if (isQueued) {
        betStatus.textContent = `Queued: ${direction.toUpperCase()} on ${selectedCoin} (next round)`;
    } else {
        betStatus.textContent = `Active: ${direction.toUpperCase()} on ${selectedCoin}`;
    }
    betStatus.className = 'bet-status active';
}

// event listeners for clicking UP and DOWN
betUp.addEventListener('click', () => placeBet('up'));
betDown.addEventListener('click', () => placeBet('down'));

updatePriceDisplay(selectedCoin);
updatePayoutDisplay();

// main game loop. Runs once every second(1000 milisecs) and updates the entire game
setInterval(() => {
    // Tick prices and advance cycle
    for (const coin in currentPrices)
        currentPrices[coin] = randomMove(currentPrices[coin]);
    updatePriceDisplay(selectedCoin);
    cycleSecond = (cycleSecond + 1) % MINUTE;
    // On the turn of a new minute: resolve active bets, activate queued bets
    if (cycleSecond === 0) {
        for (const bet of bets) {
            if (bet.status === 'active' && bet.entry !== null) {
                resolveBet(bet.direction, bet.coin, bet.entry, currentPrices[bet.coin], bet.amount);
                bet.status = 'resolved';
            }
        }
        for (const bet of bets) {
            if (bet.status === 'queued') {
                bet.status = 'active';
                bet.entry = currentPrices[bet.coin];
            }
        }
        bets = bets.filter(b => b.status !== 'resolved');
        renderActiveBets();
        betStatus.textContent = '';
        betStatus.className = 'bet-status';
    }
    const hasQueuedBet = bets.some(b => b.status === 'queued');
    if (cycleSecond < WINDOW) {
        // Betting window: bar fills left-to-right as window counts down
        const windowProgress = (cycleSecond / WINDOW) * 100;
        timerBar.style.width = windowProgress + '%';
        timerBar.style.background = '#e8a020';
        timerCountdown.textContent = formatTime(WINDOW - cycleSecond);
        timerLabel.textContent = 'Betting window open';
    } else {
        // Lock period: bar drains as the minute runs out
        const lockProgress = ((MINUTE - cycleSecond) / (MINUTE - WINDOW)) * 100;
        timerBar.style.width = lockProgress + '%';
        timerBar.style.background = '#2e3347';
        timerCountdown.textContent = formatTime(MINUTE - cycleSecond);
        timerLabel.textContent = hasQueuedBet ? 'Bet queued for next round' : 'Betting on next round';
    }
}, 1000);
