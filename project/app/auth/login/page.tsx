'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Loader2, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [justRegistered, setJustRegistered] = useState(false);

  useEffect(() => {
    if (searchParams.get('registered') === 'true') {
      setJustRegistered(true);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(email, password);

      if (!result.success) {
        setError(result.error || 'Login failed');
      } else {
        router.push('/');
        router.refresh();
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left panel — decorative art side */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden bg-black flex-col">
        {/* Subtle background layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-[#111] to-black" />
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#6CD8D1]/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-white/5 rounded-full blur-[80px]" />
        </div>

        <div className="relative z-10 flex flex-col justify-between h-full p-14">
          <Link href="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors text-sm w-fit">
            <ArrowLeft size={15} />
            Back to site
          </Link>

          <div>
            <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center mb-10">
              <span className="text-2xl font-serif italic text-white/30">CM</span>
            </div>
            <h1 className="text-5xl font-light text-white leading-tight mb-5 tracking-tight">
              Chandrika<br />
              <span className="font-serif italic text-white/60">Maelge</span>
            </h1>
            <p className="text-white/30 text-base font-light max-w-[260px] leading-relaxed">
              Access the creative studio — manage artworks, stories, and connect with your audience.
            </p>
          </div>

          <p className="text-white/15 text-xs">
            © {new Date().getFullYear()} Chandrika Maelge Art
          </p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile back link */}
          <div className="lg:hidden mb-10">
            <Link href="/" className="inline-flex items-center gap-2 text-black/40 hover:text-black transition-colors text-sm">
              <ArrowLeft size={15} />
              Back to site
            </Link>
          </div>

          {/* Header */}
          <div className="mb-10">
            <span className="block text-xs tracking-[0.25em] uppercase text-black/30 mb-3">Welcome back</span>
            <h2 className="text-4xl font-light text-black tracking-tight">Sign In</h2>
            <p className="text-black/40 mt-2 font-light">Access your account</p>
          </div>

          {/* Success / Error Banners */}
          {justRegistered && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 flex items-center gap-3"
            >
              <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
              <p className="text-emerald-600 text-sm">Account created — please sign in.</p>
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 rounded-xl border border-red-500/20 bg-red-500/5 p-4 flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-red-600 text-sm">{error}</p>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-black/60 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                disabled={loading}
                className="w-full px-5 py-4 rounded-xl bg-black/[0.02] border border-black/[0.08] text-black placeholder-black/25 focus:outline-none focus:border-black/20 focus:bg-white transition-all disabled:opacity-50 text-base"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-black/60 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={loading}
                className="w-full px-5 py-4 rounded-xl bg-black/[0.02] border border-black/[0.08] text-black placeholder-black/25 focus:outline-none focus:border-black/20 focus:bg-white transition-all disabled:opacity-50 text-base"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 mt-2 rounded-xl bg-black text-white font-medium hover:bg-black/85 transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-base"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in…
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-black/[0.06] text-center">
            <p className="text-black/40 text-sm font-light">
              Don&apos;t have an account?{' '}
              <Link href="/auth/signup" className="text-black hover:text-black/60 transition-colors underline underline-offset-4">
                Create one
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
