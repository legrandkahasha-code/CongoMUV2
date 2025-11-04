interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}
export declare function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps): JSX.Element | null;
export {};
