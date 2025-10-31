// Mock payments for AdminReports
export interface Payment {
  id: string;
  ts: string;
  bookingRef: string;
  amount: number;
  method: string;
  status: string;
}

export function getPayments(): Payment[] {
  return [
    {
      id: 'pay-1',
      ts: new Date().toISOString(),
      bookingRef: 'BK-001',
      amount: 150000,
      method: 'card',
      status: 'success',
    },
    {
      id: 'pay-2',
      ts: new Date(Date.now() - 86400000).toISOString(),
      bookingRef: 'BK-002',
      amount: 35000,
      method: 'mobile',
      status: 'success',
    },
    {
      id: 'pay-3',
      ts: new Date(Date.now() - 2 * 86400000).toISOString(),
      bookingRef: 'BK-003',
      amount: 120000,
      method: 'cash',
      status: 'failed',
    },
  ];
}
