interface ErrorScreenProps {
    message?: string;
    onRetry?: () => void;
}
export default function ErrorScreen({ message, onRetry }: ErrorScreenProps): JSX.Element;
export {};
