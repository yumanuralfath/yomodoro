<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PomodoroSession;
use Inertia\Inertia;

class PomodoroSessionController extends Controller
{
    public function index()
    {
        $userId = session('auth_user')['id'];

        $sessions = PomodoroSession::query()->where('api_user_id', $userId)
            ->latest()
            ->limit(20)
            ->get();

        return Inertia::render('Pomodoro/Index', ['sessions' => $sessions]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'task_name' => ['nullable', 'string', 'max:255'],
            'type' => ['required', 'in:work,short_break,long_break'],
            'duration_minutes' => ['required', 'integer', 'min:1'],
            'started_at' => ['required', 'date'],
            'ended_at' => ['nullable', 'date'],
            'completed' => ['boolean'],
        ]);

        $data['api_user_id'] = session('auth_user')['id'];

        PomodoroSession::create($data);

        return back();
    }
}
