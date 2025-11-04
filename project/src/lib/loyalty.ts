export type LoyaltyItem = { ts: number; delta: number; reason?: string; ref?: string };

export const getHistory = (): LoyaltyItem[] => {
  try {
    const raw = localStorage.getItem('loyalty_history');
    if (raw) return JSON.parse(raw);
  } catch {}
  // Données de démonstration
  return [
    { ts: Date.now() - 86400000 * 2, delta: 50, reason: 'Réservation', ref: 'BK-001' },
    { ts: Date.now() - 86400000, delta: -10, reason: 'Annulation partielle', ref: 'BK-001' },
    { ts: Date.now(), delta: 20, reason: 'Bonus fidélité' }
  ];
};

export default { getHistory };
