import { useState } from 'react';
import { MIN_DEPOSIT, MAX_DEPOSIT, depositAmountError } from '../api/wallet';

const QUICK_AMOUNTS = [10, 100, 500, 1000, 5000, 10000];

// "Add funds" window: the money is fake, so any amount between MIN_DEPOSIT and
// MAX_DEPOSIT is accepted. The server checks the amount again.
//
//   balance     the current balance, to preview the new one
//   onDeposit   async (amount) => ...  sends the deposit; throws if it is refused
export default function DepositModal({ balance, onDeposit, onClose }) {
  const [amount, setAmount] = useState('100');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validation = depositAmountError(amount);
  const message = error || validation;

  async function handleSubmit(e) {
    e.preventDefault();
    if (validation) return;
    setError('');
    setLoading(true);
    try {
      await onDeposit(Number(amount));
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>Add funds</h2>
        <p className="deposit-info">
          Play money only. Between T€ {MIN_DEPOSIT} and T€ {MAX_DEPOSIT.toLocaleString('en-US')} per deposit.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="quick-amounts">
            {QUICK_AMOUNTS.map((quick) => (
              <button
                key={quick}
                type="button"
                className="quick-btn"
                onClick={() => {
                  setAmount(String(quick));
                  setError('');
                }}
              >
                {quick.toLocaleString('en-US')}
              </button>
            ))}
          </div>

          <input
            name="amount"
            type="number"
            inputMode="numeric"
            min={MIN_DEPOSIT}
            max={MAX_DEPOSIT}
            step="1"
            placeholder="Amount"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              setError('');
            }}
            required
          />

          {!validation && (
            <div className="deposit-summary">
              New balance: {(balance + Number(amount)).toLocaleString('en-US')} T€
            </div>
          )}
          {message && <div className="modal-error">{message}</div>}

          <button type="submit" disabled={loading || Boolean(validation)}>
            {loading ? 'Adding...' : 'Add funds'}
          </button>
        </form>
        <button className="modal-close" onClick={onClose}>&times;</button>
      </div>
    </div>
  );
}