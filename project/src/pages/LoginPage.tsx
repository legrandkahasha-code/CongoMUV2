import { useState } from 'react';
import { useAuth } from '@/lib/authContext';

// Supabase only: backend API removed

export default function LoginPage() {
  const { signInWithPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [capsOn, setCapsOn] = useState(false);
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const canSubmitPassword = emailValid && password.length > 0 && !sending;

  // Connexion simple: email + mot de passe
  const handlePasswordLogin = async () => {
    try {
      setSending(true);
      setStatus(null);
      setError(null);
      
      const res = await signInWithPassword({ email, password });
      if (res.error) throw new Error(res.error);
      // Session complète: l'AuthProvider redirigera en fonction du rôle
      setStatus('✅ Connexion réussie ! Redirection...');
    } catch (e: any) {
      setError(e?.message || 'Échec de la connexion');
    } finally {
      setSending(false);
    }
  };

  // Ne jamais rediriger depuis cette page sans session: l'AuthProvider s'en charge après SIGNED_IN

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mx-auto mb-3 text-xl" aria-hidden>
            🔐
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Connexion CongoMuv</h1>
          <p className="text-slate-600 text-sm">Entrez votre email et votre mot de passe</p>
        </div>

        {error && <div className="mb-3 p-3 rounded bg-red-100 text-red-700 text-sm">{error}</div>}
        {status && <div className="mb-3 p-3 rounded bg-blue-50 text-blue-700 text-sm">{status}</div>}

        <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">Adresse email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="nom@exemple.com"
          disabled={sending}
          className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 mb-4 disabled:opacity-60"
        />

        <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">Mot de passe</label>
        <input
          id="password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyUp={(e) => setCapsOn((e as any).getModifierState && (e as any).getModifierState('CapsLock'))}
          placeholder="Votre mot de passe"
          disabled={sending}
          className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 mb-4 disabled:opacity-60"
        />
        <div className="flex items-center justify-between -mt-3 mb-3">
          <button type="button" onClick={() => setShowPassword(v => !v)} className="text-xs text-blue-700 hover:underline">
            {showPassword ? 'Masquer' : 'Afficher'} le mot de passe
          </button>
          {capsOn && <span className="text-xs text-amber-600">Verr. Maj activée</span>}
        </div>
        {!emailValid && email.length > 0 && (
          <p className="text-xs text-red-600 mb-2">Adresse email invalide.</p>
        )}

        <button
          onClick={handlePasswordLogin}
          disabled={!canSubmitPassword}
          className="w-full bg-gradient-to-r from-blue-700 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-800 hover:to-blue-700 transition disabled:opacity-50"
        >
          {sending ? 'Connexion...' : 'Se connecter'}
        </button>
        <div className="text-center mt-4 text-sm">
          <a href="#/signup" className="text-blue-700 hover:underline">Pas de compte ? Inscription</a>
        </div>
      </div>
    </div>
  );
}
