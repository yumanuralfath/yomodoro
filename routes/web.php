<?php

use App\Http\Controllers\Auth\ExternalAuthController;
use App\Http\Controllers\PomodoroSessionController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::inertia('/', 'welcome')->name('home');

Route::middleware('guest')->group(function () {
    Route::get('login', [ExternalAuthController::class, 'showLogin'])->name('login');
    Route::post('login', [ExternalAuthController::class, 'login']);
    Route::get('register', [ExternalAuthController::class, 'showRegister'])->name('register');
    Route::post('register', [ExternalAuthController::class, 'register']);
    Route::get('forgot-password', [ExternalAuthController::class, 'showForgotPassword'])->name('password.request');
    Route::post('forgot-password', [ExternalAuthController::class, 'forgotPassword'])->name('password.email');
    Route::get('reset-password', [ExternalAuthController::class, 'showResetPassword'])->name('password.reset');
    Route::post('reset-password', [ExternalAuthController::class, 'resetPassword'])->name('password.update');
});

Route::middleware('api.auth')->group(function () {
    Route::post('logout', [ExternalAuthController::class, 'logout'])->name('logout');

    Route::get('dashboard', fn () => Inertia::render('dashboard'))->name('dashboard');

    Route::get('pomodoro', [PomodoroSessionController::class, 'index'])->name('pomodoro.index');
    Route::post('pomodoro/sessions', [PomodoroSessionController::class, 'store'])->name('pomodoro.store');
});
