'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import {
  BookOpen,
  ChevronRight,
  Download,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  ShieldAlert,
  TriangleAlert,
} from 'lucide-react';

import { CitizenShield } from '@/components/citizen/CitizenShield';

/**
 * Citizen Login — frontend only.
 *
 * No Supabase / real auth yet. "Log in" simply navigates to /citizen; every
 * other control is a placeholder interaction until the backend lands.
 */

const QUICK_ACCESS = [
  {
    icon: BookOpen,
    tone: 'bg-emerald-600',
    title: 'View Safety Guides',
    subtitle: 'What to do before, during, after',
  },
  {
    icon: Phone,
    tone: 'bg-blue-600',
    title: 'Emergency Contacts',
    subtitle: 'Helplines, hospitals, key services',
  },
  {
    icon: Download,
    tone: 'bg-orange-500',
    title: 'Offline Emergency Pack',
    subtitle: 'Maps, guides, contacts (offline)',
  },
] as const;

export default function CitizenLoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(true);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    router.push('/citizen');
  };

  return (
    <main className="min-h-screen bg-[#eef3f9]">
      <div className="mx-auto w-full max-w-md px-4 pb-10 pt-6 sm:max-w-lg">
        {/* Header with a subtle mountain backdrop */}
        <header className="relative overflow-hidden pb-6">
          <svg
            className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-40 w-full opacity-60"
            viewBox="0 0 400 160"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <polygon points="0,160 90,60 180,160" fill="#c9d9ec" />
            <polygon points="120,160 240,40 360,160" fill="#d6e3f0" />
            <polygon points="260,160 330,90 400,160" fill="#c9d9ec" />
          </svg>

          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <CitizenShield />
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
                  RAKSHA
                </h1>
                <p className="text-sm text-slate-500">Citizen Login</p>
              </div>
            </div>

            <div className="mt-1 text-right text-xs leading-relaxed text-slate-600">
              <p>Safer Communities</p>
              <p>Stronger Tomorrows</p>
              <div className="ml-auto mt-1 h-0.5 w-8 bg-teal-500" />
            </div>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-slate-700">
            Secure access to alerts, reports, and offline emergency tools.
          </p>
        </header>

        {/* Login card */}
        <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200/70 sm:p-7">
          <h2 className="text-xl font-bold text-slate-900">Welcome Back</h2>
          <p className="mt-1 text-sm text-slate-500">
            Log in to your RAKSHA Citizen account.
          </p>

          <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit}>
            <label className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-100">
              <Mail size={18} className="shrink-0 text-slate-400" aria-hidden="true" />
              <span className="sr-only">Mobile Number or Email</span>
              <input
                type="text"
                placeholder="Mobile Number / Email"
                autoComplete="username"
                className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
              />
            </label>

            <label className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-100">
              <Lock size={18} className="shrink-0 text-slate-400" aria-hidden="true" />
              <span className="sr-only">Password</span>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                autoComplete="current-password"
                className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="shrink-0 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </label>

            <label className="flex items-center gap-2.5 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={keepSignedIn}
                onChange={(event) => setKeepSignedIn(event.target.checked)}
                className="size-4 rounded border-slate-300 text-blue-600 accent-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-500"
              />
              Keep me signed in on this device
            </label>

            <button
              type="submit"
              className="rounded-xl bg-teal-700 py-3.5 text-sm font-bold tracking-wide text-white transition-colors hover:bg-teal-800 active:bg-teal-900"
            >
              LOG IN
            </button>

            <button
              type="button"
              onClick={() => router.push('/citizen')}
              className="rounded-xl border-2 border-blue-700 py-3 text-sm font-bold text-blue-700 transition-colors hover:bg-blue-50 active:bg-blue-100"
            >
              Continue with OTP
            </button>
          </form>

          <div className="mt-5 flex items-center justify-between text-sm font-medium">
            <button type="button" className="text-blue-700 hover:underline">
              Forgot Password?
            </button>
            <button type="button" className="text-blue-700 hover:underline">
              Create New Account
            </button>
          </div>
        </section>

        {/* Quick access */}
        <section className="mt-7">
          <div className="flex items-baseline justify-between">
            <h3 className="text-lg font-bold text-slate-900">Quick Access</h3>
            <span className="text-xs text-slate-500">Available without login</span>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-3">
            {QUICK_ACCESS.map(({ icon: Icon, tone, title, subtitle }) => (
              <button
                key={title}
                type="button"
                className="flex flex-col items-start gap-2 rounded-2xl bg-white p-3.5 text-left shadow-sm ring-1 ring-slate-200/70 transition-shadow hover:shadow-md"
              >
                <span className={`grid size-9 place-items-center rounded-full ${tone}`}>
                  <Icon size={17} className="text-white" aria-hidden="true" />
                </span>
                <span className="flex w-full items-center justify-between gap-1 text-[13px] font-bold leading-tight text-slate-900">
                  {title}
                  <ChevronRight size={14} className="shrink-0 text-slate-300" aria-hidden="true" />
                </span>
                <span className="text-[11px] leading-snug text-slate-500">{subtitle}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Emergency banner */}
        <Link
          href="#"
          className="mt-5 flex items-center gap-3 rounded-2xl bg-red-50 px-4 py-3.5 ring-1 ring-red-100 transition-colors hover:bg-red-100"
        >
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-red-700">
            <TriangleAlert size={16} className="text-white" aria-hidden="true" />
          </span>
          <span className="flex-1">
            <span className="block text-sm font-bold text-red-700">
              Emergency? Get help fast
            </span>
            <span className="block text-xs text-red-700/80">
              View helplines and critical information
            </span>
          </span>
          <ChevronRight size={18} className="shrink-0 text-red-400" aria-hidden="true" />
        </Link>

        {/* Disclaimer */}
        <footer className="mt-6 flex items-start gap-2.5 text-[11.5px] leading-relaxed text-slate-500">
          <ShieldAlert size={16} className="mt-0.5 shrink-0 text-slate-400" aria-hidden="true" />
          <p>
            For citizen reporting and safety information only. Not for
            emergency response. In a life-threatening situation, call the
            appropriate official emergency service.
          </p>
        </footer>
      </div>
    </main>
  );
}
