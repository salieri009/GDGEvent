import { FormEvent, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { adminLogin } from '../api/adminApi';
import { apiErrorMessage } from '@/shared/api/client';
import { isAdminLoggedIn } from '../lib/adminAuth';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (isAdminLoggedIn()) {
    return <Navigate to="/admin/applications" replace />;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await adminLogin(apiKey.trim());
      navigate('/admin/applications');
    } catch (err) {
      setError(apiErrorMessage(err, 'Login failed'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto py-24 px-8">
      <h1 className="font-headline text-4xl font-black uppercase italic mb-4">Operator Login</h1>
      <p className="text-sm mb-8 opacity-80">
        Enter the admin API key from <code className="font-mono">ADMIN_API_KEY</code> in your backend
        env.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6 border-4 border-slate-border p-8 rounded-geo bg-white shadow-hard">
        <div>
          <label htmlFor="admin-key" className="block text-xs font-bold uppercase tracking-[0.2em] mb-2">
            Admin API Key
          </label>
          <input
            id="admin-key"
            type="password"
            autoComplete="current-password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full border-4 border-slate-border rounded-xl px-4 py-3 font-mono text-sm"
            required
          />
        </div>

        {error && <p className="text-red-600 text-sm font-bold">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-primary border-4 border-slate-border rounded-full py-3 font-black uppercase tracking-wider shadow-hard hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all disabled:opacity-60"
        >
          {submitting ? 'Checking...' : 'Sign In'}
        </button>
      </form>

      <p className="mt-8 text-center text-xs uppercase tracking-wider">
        <Link to="/" className="hover:text-primary font-bold">
          ← Back to DoodlePaws
        </Link>
      </p>
    </div>
  );
}
