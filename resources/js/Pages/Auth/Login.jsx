import React from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Lock, Mail, Key, Sparkles, ArrowRight } from 'lucide-react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: 'admin@livasya.com',
        password: 'password123',
        remember: true,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Masuk Admin - Employee Award" />

            {/* Quick Demo Credentials Pill */}
            <div className="mb-6 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                    <span className="font-semibold block text-amber-200">Kredensial Superadmin Bawaan:</span>
                    <span className="font-mono text-[11px] text-amber-300/90 block mt-0.5">
                        Email: admin@livasya.com | Sandi: password123
                    </span>
                </div>
            </div>

            {status && (
                <div className="mb-4 text-xs font-medium text-emerald-400 bg-emerald-950/40 p-3 rounded-xl border border-emerald-500/20">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-4">
                <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                        Email Administrator
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                            <Mail className="w-4 h-4" />
                        </div>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            autoComplete="username"
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="admin@livasya.com"
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-slate-100 placeholder-slate-500 text-sm focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors"
                            required
                        />
                    </div>
                    {errors.email && <p className="text-xs text-rose-400 mt-1">{errors.email}</p>}
                </div>

                <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                        Kata Sandi
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                            <Lock className="w-4 h-4" />
                        </div>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            autoComplete="current-password"
                            onChange={(e) => setData('password', e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-slate-100 placeholder-slate-500 text-sm focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors"
                            required
                        />
                    </div>
                    {errors.password && <p className="text-xs text-rose-400 mt-1">{errors.password}</p>}
                </div>

                <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                            className="w-4 h-4 rounded border-slate-700 text-amber-500 focus:ring-amber-400 bg-slate-900"
                        />
                        <span className="text-xs text-slate-400">Ingat saya</span>
                    </label>

                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="text-xs text-slate-400 hover:text-amber-300 transition-colors"
                        >
                            Lupa sandi?
                        </Link>
                    )}
                </div>

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold text-xs tracking-wider uppercase shadow-gold-glow hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 transition-all"
                    >
                        <span>{processing ? 'Memproses Masuk...' : 'Masuk ke Panel Admin'}</span>
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </form>
        </GuestLayout>
    );
}
