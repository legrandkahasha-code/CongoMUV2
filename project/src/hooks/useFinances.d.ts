interface Transaction {
    id: string;
    type: 'entree' | 'sortie';
    amount: number;
    description: string;
    category: string;
    date: string;
    created_at: string;
}
interface FinanceStats {
    total_entrees: number;
    total_sorties: number;
    balance: number;
    entrees_today: number;
    sorties_today: number;
    entrees_month: number;
    sorties_month: number;
}
export declare const useFinances: () => {
    transactions: Transaction[];
    stats: FinanceStats;
    loading: boolean;
    error: string | null;
    refresh: (filter?: string) => Promise<void>;
    refreshStats: () => Promise<void>;
    createTransaction: (transactionData: Omit<Transaction, "id" | "created_at">) => Promise<{
        success: boolean;
    }>;
};
export default useFinances;
