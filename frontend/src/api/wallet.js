const API_URL = '';

// Limits of ONE deposit, in T€ (play money). The server checks them too
// (CreditWalletDto in the backend): these only show the problem early.
export const MIN_DEPOSIT = 10;
export const MAX_DEPOSIT = 50000;

// The message to show under the amount field, or '' when the amount can be sent.
export function depositAmountError(value) {
  const text = String(value).trim();
  if (text === '') return 'Enter an amount';
  if (!/^\d+$/.test(text)) return 'Enter a whole number';
  const amount = Number(text);
  if (amount < MIN_DEPOSIT) return `The minimum deposit is T€ ${MIN_DEPOSIT}`;
  if (amount > MAX_DEPOSIT) return `The maximum deposit is T€ ${MAX_DEPOSIT.toLocaleString('en-US')}`;
  return '';
}

// POST /wallet/credit -> adds play money to the logged-in user's own account.
// Answers { id, username, wallet } with the new balance in `wallet`.
// A refused request throws an Error with the server's message and the HTTP status.
export async function depositFunds(token, amount) {
  const response = await fetch(`${API_URL}/wallet/credit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify({ amount }),
  });

  if (!response.ok) {
    let message = 'Could not add the funds';
    try {
      const body = await response.json();
      message = Array.isArray(body.message) ? body.message.join(', ') : body.message || message;
    } catch {
      // the answer was not JSON: keep the default message
    }
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  return response.json();
}