import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import RetryPanel from '@/shared/ui/RetryPanel';
import LoadingMessage from '@/shared/ui/LoadingMessage';
import { useAsyncResource } from '@/shared/hooks/useAsyncResource';
import type { AdoptionApplication } from '@/shared/types/application';
import AdminGuard from '../components/AdminGuard';
import { adminLogout, listApplications, reviewApplication } from '../api/adminApi';
import { apiErrorMessage } from '@/shared/api/client';

function AdminApplicationsContent() {
  const load = useCallback(() => listApplications('pending'), []);
  const { data: applications, loading, error, reload } = useAsyncResource(load);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const handleReview = async (app: AdoptionApplication, action: 'approve' | 'reject') => {
    setBusyId(app.id);
    setActionError(null);
    try {
      await reviewApplication(app.id, action);
      await reload();
    } catch (err) {
      setActionError(apiErrorMessage(err, 'Review failed'));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-16 px-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="font-headline text-4xl font-black uppercase italic">Pending Applications</h1>
          <p className="text-xs uppercase tracking-[0.2em] mt-2 opacity-70">Operator dashboard (v2)</p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/pets"
            className="px-4 py-2 border-4 border-slate-border rounded-full text-xs font-bold uppercase tracking-wider hover:bg-secondary transition-colors"
          >
            Public site
          </Link>
          <button
            type="button"
            onClick={() => {
              adminLogout();
              window.location.href = '/admin/login';
            }}
            className="px-4 py-2 border-4 border-slate-border rounded-full text-xs font-bold uppercase tracking-wider hover:bg-primary transition-colors"
          >
            Log out
          </button>
        </div>
      </div>

      {loading && <LoadingMessage>Fetching applications...</LoadingMessage>}
      {error && !loading && <RetryPanel message={error} onRetry={reload} />}
      {actionError && (
        <p className="mb-6 text-red-600 font-bold border-4 border-red-600 p-4 rounded-xl">{actionError}</p>
      )}

      {!loading && !error && applications?.length === 0 && (
        <p className="text-center font-black uppercase italic text-2xl opacity-60 py-16">
          No pending applications — the pack is quiet!
        </p>
      )}

      {!loading && !error && applications && applications.length > 0 && (
        <ul className="space-y-6">
          {applications.map((app) => (
            <li
              key={app.id}
              className="border-4 border-slate-border rounded-geo-lg p-6 bg-white shadow-hard flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
              <div>
                <p className="font-headline text-2xl font-black uppercase italic">{app.petName}</p>
                <p className="text-sm mt-1">
                  <span className="font-bold">{app.applicantName}</span> · snack: {app.favoriteSnack ?? '—'}
                </p>
                <p className="text-xs font-mono opacity-60 mt-2">{app.id}</p>
              </div>
              <div className="flex gap-3 shrink-0">
                <button
                  type="button"
                  disabled={busyId === app.id}
                  onClick={() => handleReview(app, 'reject')}
                  className="px-5 py-2 border-4 border-slate-border rounded-full font-bold uppercase text-xs tracking-wider hover:bg-red-100 disabled:opacity-50"
                >
                  Reject
                </button>
                <button
                  type="button"
                  disabled={busyId === app.id}
                  onClick={() => handleReview(app, 'approve')}
                  className="px-5 py-2 bg-primary border-4 border-slate-border rounded-full font-bold uppercase text-xs tracking-wider shadow-hard hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none disabled:opacity-50"
                >
                  Approve
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function AdminApplicationsPage() {
  return (
    <AdminGuard>
      <AdminApplicationsContent />
    </AdminGuard>
  );
}
