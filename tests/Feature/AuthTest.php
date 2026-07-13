<?php

use Illuminate\Support\Facades\Http;

test('login screen can be rendered', function () {
    $response = $this->get('/login');

    $response->assertStatus(200);
});

test('users can login using external API', function () {
    $baseUrl = config('services.auth_api.base_url');

    Http::fake([
        "{$baseUrl}/login" => Http::response([
            'success' => true,
            'data' => [
                'access_token' => 'mocked-jwt-token',
                'refresh_token' => 'mocked-refresh-token',
                'token_type' => 'Bearer',
                'expires_in' => 3600,
                'user' => [
                    'id' => 'user-uuid-1234',
                    'username' => 'yuma',
                    'email' => 'yuma@example.com',
                    'name' => 'Yuma'
                ]
            ]
        ], 200)
    ]);

    $response = $this->post('/login', [
        'email' => 'yuma@example.com',
        'password' => 'password123',
    ]);

    $response->assertRedirect('/dashboard');
    $this->assertEquals('mocked-jwt-token', session('auth_token'));
    $this->assertEquals('Yuma', session('auth_user')['name']);
});

test('login fails with invalid credentials', function () {
    $baseUrl = config('services.auth_api.base_url');

    Http::fake([
        "{$baseUrl}/login" => Http::response([
            'success' => false,
            'error' => 'Invalid email or password',
            'code' => 401
        ], 401)
    ]);

    $response = $this->post('/login', [
        'email' => 'wrong@example.com',
        'password' => 'wrongpassword',
    ]);

    $response->assertSessionHasErrors('email');
    $this->assertNull(session('auth_token'));
});

test('register screen can be rendered', function () {
    $response = $this->get('/register');

    $response->assertStatus(200);
});

test('users can register using external API', function () {
    $baseUrl = config('services.auth_api.base_url');

    Http::fake([
        "{$baseUrl}/register" => Http::response([
            'success' => true,
            'data' => [
                'message' => 'Registration successful! Please check your email to verify your account.',
                'user' => [
                    'id' => 'user-uuid-1234',
                    'username' => 'yuma',
                    'email' => 'yuma@example.com',
                ]
            ]
        ], 200)
    ]);

    $response = $this->post('/register', [
        'username' => 'yuma',
        'email' => 'yuma@example.com',
        'password' => 'password123',
    ]);

    $response->assertRedirect('/register/success?email=yuma%40example.com');
});

test('register success screen can be rendered', function () {
    $response = $this->get('/register/success?email=yuma@example.com');

    $response->assertStatus(200);
});

test('registration fails on conflict', function () {
    $baseUrl = config('services.auth_api.base_url');

    Http::fake([
        "{$baseUrl}/register" => Http::response([
            'success' => false,
            'error' => 'Email already registered',
            'code' => 409
        ], 409)
    ]);

    $response = $this->post('/register', [
        'username' => 'yuma',
        'email' => 'yuma@example.com',
        'password' => 'password123',
    ]);

    $response->assertSessionHasErrors('email');
});

test('forgot password screen can be rendered', function () {
    $response = $this->get('/forgot-password');

    $response->assertStatus(200);
});

test('users can request password reset link', function () {
    $baseUrl = config('services.auth_api.base_url');

    Http::fake([
        "{$baseUrl}/forgot-password" => Http::response([
            'success' => true,
            'message' => 'If that email exists, you will receive a reset link shortly.'
        ], 200)
    ]);

    $response = $this->post('/forgot-password', [
        'email' => 'yuma@example.com',
    ]);

    $response->assertSessionHas('status', 'If that email exists, you will receive a reset link shortly.');
});

test('reset password screen can be rendered', function () {
    $response = $this->get('/reset-password?token=mocked-token');

    $response->assertStatus(200);
});

test('users can reset password using token', function () {
    $baseUrl = config('services.auth_api.base_url');

    Http::fake([
        "{$baseUrl}/reset-password" => Http::response([
            'success' => true,
            'message' => 'Password reset successfully. Please login with your new password.'
        ], 200)
    ]);

    $response = $this->post('/reset-password', [
        'token' => 'mocked-token',
        'password' => 'newpassword123',
    ]);

    $response->assertRedirect('/login');
    $response->assertSessionHas('status', 'Password reset successfully. Please login with your new password.');
});

test('users can log out', function () {
    session([
        'auth_token' => 'mocked-token',
        'auth_user' => ['id' => '1', 'name' => 'Yuma'],
    ]);

    $response = $this->post('/logout');

    $response->assertRedirect('/login');
    $this->assertNull(session('auth_token'));
    $this->assertNull(session('auth_user'));
});
