type ToastVariant = 'default' | 'destructive' | 'success' | 'warning' | 'info';
interface ToastOptions {
    title: string;
    description?: string;
    variant?: ToastVariant;
    duration?: number;
}
export declare const useToast: () => {
    toast: ({ title, description, variant, duration }: ToastOptions) => () => void;
};
export default useToast;
