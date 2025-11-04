import { ReactNode } from 'react';
interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}
export declare function Modal({ isOpen, onClose, title, children, size }: ModalProps): JSX.Element | null;
export {};
