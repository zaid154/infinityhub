import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import api from '../services/api';

export default function VerifyEmail() {
  const { token } = useParams();
  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await api.get(`/auth/verify-email/${token}`);
        if (res.data.success) {
          setStatus('success');
          setMessage(res.data.message);
        }
      } catch (err) {
        setStatus('error');
        setMessage(err.response?.data?.message || 'Verification link is invalid or has expired.');
      }
    };
    verify();
  }, [token]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xl max-w-md w-full text-center space-y-4">
        {status === 'verifying' && (
          <>
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto" />
            <h2 className="text-xl font-bold text-slate-900">Verifying Email Address...</h2>
            <p className="text-xs text-slate-500">Please wait while we validate your credentials.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Email Verified Successfully!</h2>
            <p className="text-xs text-slate-600">{message}</p>
            <div className="pt-4">
              <Link
                to="/login"
                className="inline-block px-6 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold shadow transition"
              >
                Proceed to Sign In
              </Link>
            </div>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-16 h-16 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <XCircle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Verification Failed</h2>
            <p className="text-xs text-slate-600">{message}</p>
            <div className="pt-4">
              <Link
                to="/login"
                className="inline-block px-6 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold shadow transition"
              >
                Return to Login
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
