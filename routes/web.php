<?php

use App\Http\Controllers\Auth\ExternalAuthController;
use App\Http\Controllers\PomodoroSessionController;
use App\Models\PomodoroSession;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware('api.guest')->group(function () {
    Route::get('login', [ExternalAuthController::class, 'showLogin'])->name('login');
    Route::post('login', [ExternalAuthController::class, 'login'])->name('login.store');
    Route::get('register', [ExternalAuthController::class, 'showRegister'])->name('register');
    Route::post('register', [ExternalAuthController::class, 'register'])->name('register.store');
    Route::get('register/success', [ExternalAuthController::class, 'showRegisterSuccess'])->name('register.success');
    Route::get('forgot-password', [ExternalAuthController::class, 'showForgotPassword'])->name('password.request');
    Route::post('forgot-password', [ExternalAuthController::class, 'forgotPassword'])->name('password.email');
    Route::get('reset-password', [ExternalAuthController::class, 'showResetPassword'])->name('password.reset');
    Route::post('reset-password', [ExternalAuthController::class, 'resetPassword'])->name('password.update');
});

Route::middleware('api.auth')->group(function () {
    Route::post('logout', [ExternalAuthController::class, 'logout'])->name('logout');

    Route::get('dashboard', function () {
        $userId = session('auth_user')['id'];

        $sessions = PomodoroSession::query()->where('api_user_id', $userId)->get();

        $totalSessions = $sessions->count();
        $completedSessions = $sessions->where('completed', true)->count();
        $totalFocusMinutes = $sessions->where('type', 'work')->where('completed', true)->sum('duration_minutes');
        $totalBreakMinutes = $sessions->whereIn('type', ['short_break', 'long_break'])->where('completed', true)->sum('duration_minutes');

        $recentSessions = $sessions->sortByDesc('created_at')->take(5)->values();

        return Inertia::render('Dashboard', [
            'stats' => [
                'total_sessions' => $totalSessions,
                'completed_sessions' => $completedSessions,
                'total_focus_minutes' => $totalFocusMinutes,
                'total_break_minutes' => $totalBreakMinutes,
            ],
            'recent_sessions' => $recentSessions,
        ]);
    })->name('dashboard');

    Route::get('pomodoro', [PomodoroSessionController::class, 'index'])->name('pomodoro.index');
    Route::post('pomodoro/sessions', [PomodoroSessionController::class, 'store'])->name('pomodoro.store');
});
