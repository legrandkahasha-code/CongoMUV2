interface User {
    id: string;
    email: string;
    full_name: string;
    role: 'ADMIN' | 'OPERATOR' | 'CUSTOMER' | 'DRIVER';
    phone?: string;
    organization_id?: string;
    created_at: string;
    updated_at: string;
    last_login?: string;
    is_active: boolean;
}
export declare const useUsers: () => {
    users: User[];
    loading: boolean;
    error: string | null;
    refresh: () => Promise<void>;
    createUser: (userData: Omit<User, "id" | "created_at" | "updated_at">) => Promise<any>;
    updateUser: (id: string, updates: Partial<User>) => Promise<any>;
};
export default useUsers;
