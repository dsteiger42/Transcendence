export function fmt(price) {
  return '$' + price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 });
}

export function formatTime(s) {
  return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
}

// TODELETE: random number generator to simulate the market (same as before —
// this is the piece that should eventually be replaced by real backend data)
export function randomMove(price) {
  return price * (1 + (Math.random() - 0.5) * 0.002);
}
