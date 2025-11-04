export interface Payment {
    id: string;
    ts: string;
    bookingRef: string;
    amount: number;
    method: string;
    status: string;
}
export declare function getPayments(): Payment[];
