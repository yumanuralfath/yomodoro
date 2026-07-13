import { Head, Link, usePage } from '@inertiajs/react';
import {
    Flame,
    Coffee,
    Trophy,
    Clock,
    CheckCircle2,
    Calendar,
    Play,
    Sparkles,
    ChevronRight,
    TrendingUp,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { dashboard } from '@/routes';
import { index as pomodoroIndex } from '@/routes/pomodoro';

interface Session {
    id: number;
    task_name: string | null;
    type: 'work' | 'short_break' | 'long_break';
    duration_minutes: number;
    started_at: string;
    ended_at: string | null;
    completed: boolean;
}

interface Stats {
    total_sessions: number;
    completed_sessions: number;
    total_focus_minutes: number;
    total_break_minutes: number;
}

type Props = {
    stats: Stats;
    recent_sessions: Session[];
};

export default function Dashboard({ stats, recent_sessions = [] }: Props) {
    const { auth } = usePage().props;
    const user = auth.user;

    // Greeting based on time
    const getGreeting = () => {
        const hour = new Date().getHours();

        if (hour < 12) {
            return 'Good morning';
        }

        if (hour < 17) {
            return 'Good afternoon';
        }

        return 'Good evening';
    };

    // Format minutes to a clean duration
    const formatDuration = (mins: number) => {
        if (mins < 60) {
            return `${mins}m`;
        }

        const hrs = Math.floor(mins / 60);
        const remainingMins = mins % 60;

        return remainingMins > 0 ? `${hrs}h ${remainingMins}m` : `${hrs}h`;
    };

    // Completion rate percentage
    const completionRate =
        stats.total_sessions > 0
            ? Math.round(
                  (stats.completed_sessions / stats.total_sessions) * 100,
              )
            : 0;

    const getModeLabel = (type: Session['type']) => {
        switch (type) {
            case 'work':
                return 'Work';
            case 'short_break':
                return 'Short Break';
            case 'long_break':
                return 'Long Break';
        }
    };

    const getModeBadgeColor = (type: Session['type']) => {
        switch (type) {
            case 'work':
                return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
            case 'short_break':
                return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
            case 'long_break':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
        }
    };

    return (
        <>
            <Head title="Dashboard" />
            <div className="mx-auto flex h-full max-w-6xl flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Welcome Banner */}
                <div className="relative overflow-hidden rounded-2xl border border-sidebar-border bg-linear-to-r from-red-500/10 via-orange-500/5 to-transparent p-6 dark:border-sidebar-border">
                    <div className="relative z-10 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                        <div className="space-y-1">
                            <h2 className="text-2xl font-bold tracking-tight">
                                {getGreeting()},{' '}
                                {user?.name || user?.username || 'User'}!
                            </h2>
                            <p className="flex items-center gap-1.5 text-sm text-neutral-500 dark:text-neutral-400">
                                <Sparkles className="h-4 w-4 text-orange-500" />
                                Ready to boost your productivity today? Start a
                                new pomodoro timer.
                            </p>
                        </div>
                        <div>
                            <Button
                                asChild
                                size="lg"
                                className="gap-2 bg-red-600 text-white shadow-lg shadow-red-600/20 hover:bg-red-700"
                            >
                                <Link href={pomodoroIndex().url}>
                                    <Play className="h-4 w-4 fill-current" />
                                    Start Focus Session
                                </Link>
                            </Button>
                        </div>
                    </div>
                    {/* Background glow effects */}
                    <div className="absolute top-0 right-0 -z-10 h-64 w-64 rounded-full bg-red-500/10 blur-3xl filter" />
                    <div className="absolute bottom-0 left-1/3 -z-10 h-32 w-32 rounded-full bg-orange-500/10 blur-2xl filter" />
                </div>

                {/* Stats Grid */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Total Focus Time */}
                    <Card className="border-sidebar-border/70 dark:border-sidebar-border">
                        <CardContent className="flex items-center gap-4 p-6">
                            <div className="rounded-xl bg-red-500/10 p-3 text-red-600 dark:text-red-400">
                                <Clock className="h-6 w-6" />
                            </div>
                            <div className="space-y-0.5">
                                <p className="text-xs font-medium tracking-wider text-neutral-500 uppercase dark:text-neutral-400">
                                    Total Focus Time
                                </p>
                                <h3 className="text-2xl font-bold tracking-tight">
                                    {formatDuration(stats.total_focus_minutes)}
                                </h3>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Sessions Completed */}
                    <Card className="border-sidebar-border/70 dark:border-sidebar-border">
                        <CardContent className="flex items-center gap-4 p-6">
                            <div className="rounded-xl bg-green-500/10 p-3 text-green-600 dark:text-green-400">
                                <CheckCircle2 className="h-6 w-6" />
                            </div>
                            <div className="space-y-0.5">
                                <p className="text-xs font-medium tracking-wider text-neutral-500 uppercase dark:text-neutral-400">
                                    Sessions Completed
                                </p>
                                <h3 className="text-2xl font-bold tracking-tight">
                                    {stats.completed_sessions}
                                </h3>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Total Break Time */}
                    <Card className="border-sidebar-border/70 dark:border-sidebar-border">
                        <CardContent className="flex items-center gap-4 p-6">
                            <div className="rounded-xl bg-blue-500/10 p-3 text-blue-600 dark:text-blue-400">
                                <Coffee className="h-6 w-6" />
                            </div>
                            <div className="space-y-0.5">
                                <p className="text-xs font-medium tracking-wider text-neutral-500 uppercase dark:text-neutral-400">
                                    Break Time Taken
                                </p>
                                <h3 className="text-2xl font-bold tracking-tight">
                                    {formatDuration(stats.total_break_minutes)}
                                </h3>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Completion Rate */}
                    <Card className="border-sidebar-border/70 dark:border-sidebar-border">
                        <CardContent className="flex items-center gap-4 p-6">
                            <div className="rounded-xl bg-orange-500/10 p-3 text-orange-600 dark:text-orange-400">
                                <TrendingUp className="h-6 w-6" />
                            </div>
                            <div className="space-y-0.5">
                                <p className="text-xs font-medium tracking-wider text-neutral-500 uppercase dark:text-neutral-400">
                                    Completion Rate
                                </p>
                                <h3 className="text-2xl font-bold tracking-tight">
                                    {completionRate}%
                                </h3>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Dashboard Details Row */}
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Recent Activity Log */}
                    <Card className="flex flex-col border-sidebar-border/70 dark:border-sidebar-border">
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg font-bold tracking-tight">
                                    Recent Sessions
                                </CardTitle>
                                <Calendar className="h-4 w-4 text-neutral-500" />
                            </div>
                            <CardDescription>
                                Your last 5 focus or break events
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1 space-y-3 overflow-y-auto pt-4">
                            {recent_sessions.length === 0 ? (
                                <div className="flex flex-col items-center justify-center space-y-2 py-12 text-center">
                                    <Clock className="h-10 w-10 text-neutral-300 dark:text-neutral-700" />
                                    <p className="text-sm font-semibold text-neutral-500">
                                        No session history yet
                                    </p>
                                    <Button asChild variant="link" size="sm">
                                        <Link href={pomodoroIndex().url}>
                                            Start your first session
                                        </Link>
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {recent_sessions.map((session) => (
                                        <div
                                            key={session.id}
                                            className="flex items-center justify-between rounded-xl border border-neutral-100 bg-neutral-50/30 p-3 dark:border-neutral-800 dark:bg-neutral-900/30"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="rounded-lg border border-neutral-100 bg-white p-2 dark:border-neutral-700 dark:bg-neutral-800">
                                                    {session.type === 'work' ? (
                                                        <Flame className="h-4 w-4 text-red-500" />
                                                    ) : session.type ===
                                                      'short_break' ? (
                                                        <Coffee className="h-4 w-4 text-green-500" />
                                                    ) : (
                                                        <Trophy className="h-4 w-4 text-blue-500" />
                                                    )}
                                                </div>
                                                <div className="space-y-0.5">
                                                    <p className="max-w-37.5 truncate text-sm font-semibold">
                                                        {session.task_name ||
                                                            'Unnamed Session'}
                                                    </p>
                                                    <p className="text-xs text-neutral-500">
                                                        {new Date(
                                                            session.started_at,
                                                        ).toLocaleDateString(
                                                            [],
                                                            {
                                                                month: 'short',
                                                                day: 'numeric',
                                                            },
                                                        )}
                                                        {' • '}
                                                        {new Date(
                                                            session.started_at,
                                                        ).toLocaleTimeString(
                                                            [],
                                                            {
                                                                hour: '2-digit',
                                                                minute: '2-digit',
                                                            },
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end gap-1">
                                                <Badge
                                                    variant="outline"
                                                    className={getModeBadgeColor(
                                                        session.type,
                                                    )}
                                                >
                                                    {getModeLabel(session.type)}
                                                </Badge>
                                                <span className="text-xs font-medium text-neutral-500">
                                                    {session.duration_minutes}{' '}
                                                    min
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Productivity tips / information */}
                    <Card className="flex flex-col justify-between border-sidebar-border/70 dark:border-sidebar-border">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold tracking-tight">
                                Productivity Insights
                            </CardTitle>
                            <CardDescription>
                                Tips on how to use Pomodoro effectively
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-3">
                                <div className="space-y-1 rounded-xl border border-orange-500/10 bg-orange-500/5 p-3.5">
                                    <h4 className="flex items-center gap-2 text-sm font-semibold text-orange-600 dark:text-orange-400">
                                        <Sparkles className="h-4 w-4" />
                                        The 25-5 Rule
                                    </h4>
                                    <p className="text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
                                        Work for 25 minutes (a Pomodoro
                                        session), followed by a 5-minute short
                                        break. Repeat this cycle 4 times, then
                                        take a longer break (15-30 minutes).
                                    </p>
                                </div>
                                <div className="space-y-1 rounded-xl border border-blue-500/10 bg-blue-500/5 p-3.5">
                                    <h4 className="flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400">
                                        <Coffee className="h-4 w-4" />
                                        Take True Breaks
                                    </h4>
                                    <p className="text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
                                        During your breaks, step away from
                                        screens. Walk around, stretch, drink
                                        water, or close your eyes. Giving your
                                        eyes and brain a break increases focus.
                                    </p>
                                </div>
                            </div>

                            <Button
                                asChild
                                variant="outline"
                                className="mt-2 w-full justify-between"
                            >
                                <Link href={pomodoroIndex().url}>
                                    <span>Go to Timer</span>
                                    <ChevronRight className="h-4 w-4" />
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
