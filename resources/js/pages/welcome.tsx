import { Head, Link, usePage } from '@inertiajs/react';
import {
    Timer,
    ShieldCheck,
    BarChart3,
    Sparkles,
    ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { dashboard, login, register } from '@/routes';

export default function Welcome() {
    const { auth } = usePage().props;

    return (
        <>
            <Head title="Yomodoro - Elevate Your Focus" />
            <div className="flex min-h-screen flex-col bg-radial from-[#FFF] to-[#F7F7F7] font-sans text-neutral-900 transition-colors duration-300 dark:from-[#0a0a0a] dark:to-[#020202] dark:text-neutral-100">
                {/* Decorative glows */}
                <div className="pointer-events-none absolute top-0 left-1/4 -z-10 h-96 w-96 rounded-full bg-red-500/10 blur-3xl filter" />
                <div className="pointer-events-none absolute right-1/4 bottom-0 -z-10 h-96 w-96 rounded-full bg-orange-500/10 blur-3xl filter" />

                {/* Navbar Header */}
                <header className="sticky top-0 z-50 border-b border-neutral-100 backdrop-blur-md dark:border-neutral-800/80">
                    <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
                        <div className="flex items-center gap-2">
                            <div className="rounded-lg bg-red-600 p-2 text-white">
                                <Timer className="h-5 w-5" />
                            </div>
                            <span className="text-lg font-bold tracking-tight">
                                Yomodoro
                            </span>
                        </div>

                        <nav className="flex items-center gap-4">
                            {auth.user ? (
                                <Button
                                    asChild
                                    variant="default"
                                    className="gap-1.5 bg-red-600 font-medium text-white shadow-md shadow-red-600/10 hover:bg-red-700"
                                >
                                    <Link href={dashboard()}>
                                        Go to Dashboard
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </Button>
                            ) : (
                                <>
                                    <Button
                                        asChild
                                        variant="ghost"
                                        className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-neutral-100"
                                    >
                                        <Link href={login()}>Log in</Link>
                                    </Button>
                                    <Button
                                        asChild
                                        className="bg-red-600 font-medium text-white shadow-md shadow-red-600/10 hover:bg-red-700"
                                    >
                                        <Link href={register()}>Register</Link>
                                    </Button>
                                </>
                            )}
                        </nav>
                    </div>
                </header>

                {/* Hero Section */}
                <main className="flex flex-1 flex-col justify-center">
                    <section className="mx-auto max-w-4xl space-y-8 px-4 py-12 text-center sm:px-6 md:py-20">
                        <div className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/5 px-3 py-1 text-xs font-semibold tracking-wide text-red-600 uppercase dark:text-red-400">
                            <Sparkles className="h-3 w-3" />
                            Smart Focus Tracking
                        </div>

                        <h1 className="text-4xl leading-tight font-extrabold tracking-tight sm:text-6xl">
                            Elevate Your Focus.
                            <br />
                            <span className="bg-linear-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">
                                Track Your Productivity.
                            </span>
                        </h1>

                        <p className="mx-auto max-w-2xl text-base leading-relaxed text-neutral-500 sm:text-lg dark:text-neutral-400">
                            Yomodoro is a modern Pomodoro application designed
                            to help you organize your tasks, log your focus
                            periods, and visualizes your progress over time.
                        </p>

                        <div className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row">
                            {auth.user ? (
                                <Button
                                    asChild
                                    size="lg"
                                    className="w-full gap-2 rounded-xl bg-red-600 px-8 py-6 text-white shadow-lg shadow-red-600/20 hover:bg-red-700 sm:w-auto"
                                >
                                    <Link href={dashboard()}>
                                        Go to Dashboard
                                        <ArrowRight className="h-5 w-5" />
                                    </Link>
                                </Button>
                            ) : (
                                <>
                                    <Button
                                        asChild
                                        size="lg"
                                        className="w-full gap-2 rounded-xl bg-red-600 px-8 py-6 text-white shadow-lg shadow-red-600/20 hover:bg-red-700 sm:w-auto"
                                    >
                                        <Link href={register()}>
                                            Get Started Free
                                            <ArrowRight className="h-5 w-5" />
                                        </Link>
                                    </Button>
                                    <Button
                                        asChild
                                        size="lg"
                                        variant="outline"
                                        className="w-full rounded-xl border-neutral-200 px-8 py-6 sm:w-auto dark:border-neutral-800"
                                    >
                                        <Link href={login()}>
                                            Log in to Account
                                        </Link>
                                    </Button>
                                </>
                            )}
                        </div>
                    </section>

                    {/* Features Grid */}
                    <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 md:py-16">
                        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                            {/* Feature 1 */}
                            <div className="space-y-4 rounded-2xl border border-neutral-100 bg-white/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-neutral-200 dark:border-neutral-900 dark:bg-neutral-950/50 dark:hover:border-neutral-800">
                                <div className="w-fit rounded-xl bg-red-500/10 p-3 text-red-600 dark:text-red-400">
                                    <Timer className="h-6 w-6" />
                                </div>
                                <h3 className="text-lg font-bold">
                                    Custom Timer Session
                                </h3>
                                <p className="text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
                                    Divide your work day into focus intervals
                                    followed by short and long breaks. Maintain
                                    full control of your schedule.
                                </p>
                            </div>

                            {/* Feature 2 */}
                            <div className="space-y-4 rounded-2xl border border-neutral-100 bg-white/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-neutral-200 dark:border-neutral-900 dark:bg-neutral-950/50 dark:hover:border-neutral-800">
                                <div className="w-fit rounded-xl bg-orange-500/10 p-3 text-orange-600 dark:text-orange-400">
                                    <ShieldCheck className="h-6 w-6" />
                                </div>
                                <h3 className="text-lg font-bold">
                                    External API Auth
                                </h3>
                                <p className="text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
                                    Login safely through our unified external
                                    Authentication API, securing your workspace
                                    and sessions seamlessly.
                                </p>
                            </div>

                            {/* Feature 3 */}
                            <div className="space-y-4 rounded-2xl border border-neutral-100 bg-white/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-neutral-200 sm:col-span-2 lg:col-span-1 dark:border-neutral-900 dark:bg-neutral-950/50 dark:hover:border-neutral-800">
                                <div className="w-fit rounded-xl bg-blue-500/10 p-3 text-blue-600 dark:text-blue-400">
                                    <BarChart3 className="h-6 w-6" />
                                </div>
                                <h3 className="text-lg font-bold">
                                    Detailed Activity Log
                                </h3>
                                <p className="text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
                                    Every completed focus session is securely
                                    logged, giving you insights into your daily
                                    habits and consistency ratios.
                                </p>
                            </div>
                        </div>
                    </section>
                </main>

                {/* Footer */}
                <footer className="border-t border-neutral-100 py-8 dark:border-neutral-900">
                    <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-xs text-neutral-500 sm:flex-row sm:px-6">
                        <div className="flex items-center gap-1.5">
                            <Timer className="h-4 w-4 text-red-600" />
                            <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                                Yomodoro
                            </span>
                            <span>
                                © {new Date().getFullYear()}. All rights
                                reserved.
                            </span>
                        </div>
                        <div className="flex gap-4">
                            <span className="hover:text-neutral-900 dark:hover:text-neutral-100">
                                Secured External Auth
                            </span>
                            <span>•</span>
                            <span className="hover:text-neutral-900 dark:hover:text-neutral-100">
                                Pest Tested
                            </span>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
