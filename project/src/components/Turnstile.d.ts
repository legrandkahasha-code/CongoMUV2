declare global {
    interface Window {
        turnstile?: {
            render: (container: HTMLElement | string, opts: any) => any;
            reset: (widgetId?: string) => void;
        };
    }
}
type Props = {
    siteKey: string;
    onVerify: (token: string) => void;
    onExpire?: () => void;
    theme?: 'light' | 'dark' | 'auto';
    size?: 'normal' | 'flexible' | 'invisible';
    className?: string;
};
export default function Turnstile({ siteKey, onVerify, onExpire, theme, size, className }: Props): JSX.Element;
export {};
