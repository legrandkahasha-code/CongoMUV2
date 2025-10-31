import { useState } from 'react';
import { useAuth } from '@/lib/authContext';


export default function Signup() {
  const { signUp } = useAuth();
  const [form, setForm] = useState({
    email: '',
    password: '',
    full_name: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setForm(prev => ({ ...prev, [id]: value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const emailLower = form.email.trim().toLowerCase();
      const res = await signUp({ email: emailLower, password: form.password, full_name: form.full_name || null, phone: form.phone || null });
      if ('error' in res && res.error) {
        let errorMsg = res.error || 'Inscription échouée';
        if (errorMsg.toLowerCase().includes('password')) {
          errorMsg = 'Mot de passe trop faible. Utilisez au moins 8 caractères, une majuscule, une minuscule, un chiffre et un symbole.';
        } else if (errorMsg.toLowerCase().includes('already registered') || errorMsg.toLowerCase().includes('already exists')) {
          errorMsg = 'Cette adresse email est déjà utilisée. Connectez-vous ou utilisez un autre email.';
        }
        setError(errorMsg);
        setLoading(false);
        return;
      }
      if ('message' in res && typeof res.message === 'string') {
        setMessage(res.message);
      } else {
        setMessage('✅ Compte créé ! Vous pouvez maintenant vous connecter.');
      }
      setTimeout(() => { window.location.hash = '#/login'; }, 1200);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || "Erreur lors de l'inscription");
      } else {
        setError("Erreur lors de l'inscription");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mx-auto mb-3 text-xl" aria-hidden>📝</div>
          <h1 className="text-2xl font-bold text-slate-900">Créer un compte</h1>
          <p className="text-slate-600 text-sm">Voyageur CongoMuv</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}
        {message && !error && (
          <div className="mb-4 p-3 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 text-sm">
            {message}
          </div>
        )}

        <form onSubmit={onSubmit}>
          <label className="block text-sm font-medium text-slate-700 mb-2" htmlFor="email">Adresse email</label>
          <input id="email" type="email" value={form.email} onChange={onChange}
                 className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 mb-4" required />

          <label className="block text-sm font-medium text-slate-700 mb-2" htmlFor="password">Mot de passe</label>
          <input id="password" type="password" value={form.password} onChange={onChange}
                 className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 mb-4" required />

          <label className="block text-sm font-medium text-slate-700 mb-2" htmlFor="full_name">Nom complet (optionnel)</label>
          <input id="full_name" type="text" value={form.full_name} onChange={onChange}
                 className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 mb-4" />

          <label className="block text-sm font-medium text-slate-700 mb-2" htmlFor="phone">Téléphone (optionnel)</label>
          <input id="phone" type="tel" value={form.phone} onChange={onChange}
                 className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 mb-6" />

          <button type="submit" disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-700 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-800 hover:to-blue-700 transition disabled:opacity-50">
            {loading ? 'Création...' : 'Créer mon compte'}
          </button>
        </form>

        <div className="text-center mt-4 text-sm">
          <button className="text-blue-700 hover:underline" onClick={() => (window.location.hash = '#/login')}>
            Déjà un compte ? Se connecter
          </button>
        </div>
      </div>
    </div>
  );
}
