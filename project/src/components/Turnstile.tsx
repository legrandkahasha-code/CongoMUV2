import { useEffect, useRef } from 'react';

// Lightweight wrapper for Cloudflare Turnstile widget
// Usage:
// <Turnstile
//   siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
//   onVerify={(token) => setCaptchaToken(token)}
//   onExpire={() => setCaptchaToken('')}
// />

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

export default function Turnstile({ siteKey, onVerify, onExpire, theme = 'auto', size = 'normal', className }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let mounted = true;

    const ensureScript = () => new Promise<void>((resolve) => {
      if (window.turnstile) return resolve();
      const existing = document.querySelector('script[data-turnstile]') as HTMLScriptElement | null;
      if (existing) {
        existing.addEventListener('load', () => resolve());
        return;
      }
      const s = document.createElement('script');
      s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      s.async = true;
      s.defer = true;
      s.setAttribute('data-turnstile', '1');
      s.onload = () => resolve();
      document.head.appendChild(s);
    });

    const render = async () => {
      await ensureScript();
      if (!mounted || !containerRef.current || !window.turnstile) return;
      window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        theme,
        size,
        callback: (token: string) => onVerify(token),
        'expired-callback': () => onExpire && onExpire(),
        'error-callback': () => onExpire && onExpire(),
      });
    };

    render();
    return () => {
      mounted = false;
    };
  }, [siteKey, theme, size, onVerify, onExpire]);

  return <div ref={containerRef} className={className} />;
}
