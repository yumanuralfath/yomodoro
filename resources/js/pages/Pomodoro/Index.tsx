import { Head, router } from '@inertiajs/react';
import { Play, Pause, RotateCcw, Clock, CheckCircle2, Timer, Flame, Coffee, Trophy } from 'lucide-react';
import { useState, useRef, useEffect, useCallback } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { index as pomodoroIndex, store as pomodoroStore } from '@/routes/pomodoro';

const WORK = 25 * 60;
const SHORT_BREAK = 5 * 60;
const LONG_BREAK = 15 * 60;

type Mode = 'work' | 'short_break' | 'long_break';

interface Session {
    id: number;
    task_name: string | null;
    type: 'work' | 'short_break' | 'long_break';
    duration_minutes: number;
    started_at: string;
    ended_at: string | null;
    completed: boolean;
}

type Props = {
    sessions: Session[];
};

function durationFor(mode: Mode) {
    return mode === 'work'
        ? WORK
        : mode === 'short_break'
          ? SHORT_BREAK
          : LONG_BREAK;
}

export default function PomodoroIndex({ sessions = [] }: Props) {
    const [mode, setMode] = useState<Mode>('work');
    const [secondsLeft, setSecondsLeft] = useState(WORK);
    const [isRunning, setIsRunning] = useState(false);
    const [taskName, setTaskName] = useState('');
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const totalSeconds = durationFor(mode);
    const progress = ((totalSeconds - secondsLeft) / totalSeconds) * 100;

    const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
    const seconds = String(secondsLeft % 60).padStart(2, '0');

    function start() {
        if (isRunning) {
            return;
        }

        setIsRunning(true);
        intervalRef.current = setInterval(() => {
            setSecondsLeft((prev) => {
                if (prev <= 1) {
                    finishSession();

                    return 0;
                }

                return prev - 1;
            });
        }, 1000);
    }

    const pause = useCallback(() => {
        setIsRunning(false);

        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, []);

    const reset = useCallback(() => {
        pause();
        setSecondsLeft(durationFor(mode));
    }, [mode, pause]);

    const changeMode = useCallback((newMode: Mode) => {
        pause();
        setMode(newMode);
        setSecondsLeft(durationFor(newMode));
    }, [pause]);

    const finishSession = useCallback(() => {
        pause();
        const nowMs = Date.now();
        const startedAt = new Date(nowMs - durationFor(mode) * 1000).toISOString();
        const endedAt = new Date(nowMs).toISOString();

        router.post(
            pomodoroStore().url,
            {
                task_name: taskName || (mode === 'work' ? 'Working Session' : 'Break Time'),
                type: mode,
                duration_minutes: Math.round(durationFor(mode) / 60),
                started_at: startedAt,
                ended_at: endedAt,
                completed: true,
            },
            {
                onSuccess: () => {
                    // Reset timer but keep the task name or clear it depending on preference
                    setSecondsLeft(durationFor(mode));

                    // Optional: auto switch to break if finished work, and vice-versa
                    if (mode === 'work') {
                        changeMode('short_break');
                    } else {
                        changeMode('work');
                    }
                },
            }
        );
    }, [mode, taskName, pause, changeMode]);

    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    const pageTitle = isRunning
        ? `(${minutes}:${seconds}) ${mode === 'work' ? 'Working' : 'Relaxing'}`
        : 'Pomodoro Timer';

    const getModeLabel = (type: Mode) => {
        switch (type) {
            case 'work':
                return 'Work';
            case 'short_break':
                return 'Short Break';
            case 'long_break':
                return 'Long Break';
        }
    };

    const getModeBadgeColor = (type: Mode) => {
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
            <Head title={pageTitle} />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6 max-w-6xl mx-auto">
                <div className="grid gap-6 lg:grid-cols-3">
                    
                    {/* Timer Section (Left 2 columns) */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="border-sidebar-border/70 dark:border-sidebar-border overflow-hidden">
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-2xl font-bold tracking-tight">Yomodoro Timer</CardTitle>
                                        <CardDescription>Stay focused and manage your study/work sessions</CardDescription>
                                    </div>
                                    <Timer className="h-6 w-6 text-neutral-500" />
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6 pt-4">
                                {/* Mode Selection Tabs */}
                                <div className="grid grid-cols-3 gap-2 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                                    {(['work', 'short_break', 'long_break'] as Mode[]).map((m) => (
                                        <button
                                            key={m}
                                            onClick={() => changeMode(m)}
                                            className={`py-2 px-3 text-xs font-semibold rounded-md transition-all ${
                                                mode === m
                                                    ? 'bg-white text-neutral-900 shadow-sm dark:bg-neutral-700 dark:text-neutral-100'
                                                    : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100'
                                            }`}
                                        >
                                            {m === 'work' ? 'Work' : m === 'short_break' ? 'Short Break' : 'Long Break'}
                                        </button>
                                    ))}
                                </div>

                                {/* Timer circular / progress visualization */}
                                <div className="relative py-8 flex flex-col items-center justify-center">
                                    {/* Progress Ring / Background */}
                                    <div className="relative flex items-center justify-center w-64 h-64 rounded-full border-4 border-neutral-100 dark:border-neutral-800">
                                        
                                        {/* Radial progress visualizer */}
                                        <div 
                                            className="absolute inset-0 rounded-full border-4 transition-all duration-300"
                                            style={{
                                                borderColor: mode === 'work' ? 'rgb(239, 68, 68)' : mode === 'short_break' ? 'rgb(34, 197, 94)' : 'rgb(59, 130, 246)',
                                                clipPath: `polygon(50% 50%, 50% 0%, ${progress >= 12.5 ? '100% 0%,' : ''} ${progress >= 37.5 ? '100% 100%,' : ''} ${progress >= 62.5 ? '0% 100%,' : ''} ${progress >= 87.5 ? '0% 0%,' : ''} 50% 0%)`,
                                                opacity: isRunning ? 0.8 : 0.2,
                                                transform: 'scale(1.02)'
                                            }}
                                        />

                                        {/* Timer text */}
                                        <div className="flex flex-col items-center justify-center z-10">
                                            <span className="font-mono text-6xl font-bold tracking-tighter">
                                                {minutes}:{seconds}
                                            </span>
                                            <span className="text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mt-2">
                                                {mode === 'work' ? 'Focus Period' : 'Break Time'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Task input field */}
                                <div className="space-y-2">
                                    <Input
                                        id="taskName"
                                        value={taskName}
                                        onChange={(e) => setTaskName(e.target.value)}
                                        placeholder="What are you working on?"
                                        className="h-11 px-4 text-base"
                                        disabled={isRunning}
                                    />
                                </div>

                                {/* Controls */}
                                <div className="flex justify-center gap-4 pt-2">
                                    <Button
                                        onClick={reset}
                                        variant="outline"
                                        size="lg"
                                        className="w-24 gap-2"
                                    >
                                        <RotateCcw className="h-4 w-4" />
                                        Reset
                                    </Button>

                                    {isRunning ? (
                                        <Button
                                            onClick={pause}
                                            variant="secondary"
                                            size="lg"
                                            className="w-32 gap-2"
                                        >
                                            <Pause className="h-4 w-4" />
                                            Pause
                                        </Button>
                                    ) : (
                                        <Button
                                            onClick={start}
                                            size="lg"
                                            className={`w-32 gap-2 text-white ${
                                                mode === 'work' 
                                                    ? 'bg-red-600 hover:bg-red-700' 
                                                    : mode === 'short_break' 
                                                        ? 'bg-green-600 hover:bg-green-700' 
                                                        : 'bg-blue-600 hover:bg-blue-700'
                                            }`}
                                        >
                                            <Play className="h-4 w-4 fill-current" />
                                            Start
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* History Section (Right 1 column) */}
                    <div className="lg:col-span-1">
                        <Card className="h-full border-sidebar-border/70 dark:border-sidebar-border flex flex-col">
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-xl font-bold tracking-tight">Activity Log</CardTitle>
                                        <CardDescription>Your recent pomodoro sessions</CardDescription>
                                    </div>
                                    <Clock className="h-5 w-5 text-neutral-500" />
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1 overflow-y-auto max-h-[500px] pt-4 space-y-4">
                                {sessions.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
                                        <CheckCircle2 className="h-12 w-12 text-neutral-300 dark:text-neutral-700" />
                                        <div className="space-y-1">
                                            <p className="text-sm font-semibold text-neutral-600 dark:text-neutral-400">No sessions recorded yet</p>
                                            <p className="text-xs text-neutral-500 dark:text-neutral-500">Complete a timer session to log your progress!</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {sessions.map((session) => (
                                            <div 
                                                key={session.id} 
                                                className="flex items-center justify-between p-3 rounded-lg border border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 rounded-full bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700">
                                                        {session.type === 'work' ? (
                                                            <Flame className="h-4 w-4 text-red-500" />
                                                        ) : session.type === 'short_break' ? (
                                                            <Coffee className="h-4 w-4 text-green-500" />
                                                        ) : (
                                                            <Trophy className="h-4 w-4 text-blue-500" />
                                                        )}
                                                    </div>
                                                    <div className="space-y-0.5">
                                                        <p className="text-sm font-semibold truncate max-w-[150px]">
                                                            {session.task_name || 'Unnamed Session'}
                                                        </p>
                                                        <p className="text-xs text-neutral-500">
                                                            {new Date(session.started_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end gap-1">
                                                    <Badge variant="outline" className={getModeBadgeColor(session.type)}>
                                                        {getModeLabel(session.type)}
                                                    </Badge>
                                                    <span className="text-xs text-neutral-500 font-medium">
                                                        {session.duration_minutes} min
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}

PomodoroIndex.layout = {
    breadcrumbs: [
        {
            title: 'Pomodoro',
            href: pomodoroIndex(),
        },
    ],
};
