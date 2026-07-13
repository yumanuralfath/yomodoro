<?php

use Illuminate\Support\Facades\Http;
use App\Models\PomodoroSession;

test('unauthenticated users are redirected to login', function () {
    $response = $this->get('/pomodoro');

    $response->assertRedirect('/login');
});

test('users with expired tokens are redirected to login', function () {
    $baseUrl = config('services.auth_api.base_url');

    Http::fake([
        "{$baseUrl}/me" => Http::response([
            'success' => false,
            'error' => 'Invalid token',
            'code' => 401
        ], 401)
    ]);

    session([
        'auth_token' => 'expired-token',
        'auth_user' => ['id' => 'user-uuid-1234', 'name' => 'Yuma'],
    ]);

    $response = $this->get('/pomodoro');

    $response->assertRedirect('/login');
    $this->assertNull(session('auth_token'));
    $this->assertNull(session('auth_user'));
});

test('authenticated users can visit the pomodoro page', function () {
    $baseUrl = config('services.auth_api.base_url');

    Http::fake([
        "{$baseUrl}/me" => Http::response([
            'success' => true,
            'data' => [
                'id' => 'user-uuid-1234',
                'username' => 'yuma',
                'email' => 'yuma@example.com',
                'name' => 'Yuma'
            ]
        ], 200)
    ]);

    session([
        'auth_token' => 'mocked-jwt-token',
        'auth_user' => ['id' => 'user-uuid-1234', 'name' => 'Yuma'],
    ]);

    $response = $this->get('/pomodoro');

    $response->assertStatus(200);
});

test('authenticated users can log a pomodoro session', function () {
    $baseUrl = config('services.auth_api.base_url');

    Http::fake([
        "{$baseUrl}/me" => Http::response([
            'success' => true,
            'data' => [
                'id' => 'user-uuid-1234',
                'username' => 'yuma',
                'email' => 'yuma@example.com',
                'name' => 'Yuma'
            ]
        ], 200)
    ]);

    session([
        'auth_token' => 'mocked-jwt-token',
        'auth_user' => ['id' => 'user-uuid-1234', 'name' => 'Yuma'],
    ]);

    $response = $this->post('/pomodoro/sessions', [
        'task_name' => 'Coding feature',
        'type' => 'work',
        'duration_minutes' => 25,
        'started_at' => now()->toIso8601String(),
        'ended_at' => now()->addMinutes(25)->toIso8601String(),
        'completed' => true,
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('pomodoro_sessions', [
        'api_user_id' => 'user-uuid-1234',
        'task_name' => 'Coding feature',
        'type' => 'work',
        'duration_minutes' => 25,
        'completed' => true,
    ]);
});
