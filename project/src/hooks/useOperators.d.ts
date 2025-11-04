interface Operator {
    id: string;
    name: string;
    email: string;
    phone?: string;
    status: 'active' | 'inactive' | 'suspended';
    created_at: string;
    updated_at: string;
}
export declare const useOperators: () => {
    operators: Operator[];
    loading: boolean;
    error: string | null;
    refresh: () => Promise<void>;
    createOperator: (operatorData: any) => Promise<any>;
};
export default useOperators;
