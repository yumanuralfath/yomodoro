<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Http\Client\Response;

class AuthApiService
{
    protected string $baseUrl;

    public function __construct()
    {
        $this->baseUrl = config('services.auth_api.base_url');
    }

    public function login(string $email, string $password): Response
    {
        return Http::post("{$this->baseUrl}/login", [
            'email' => $email,
            'password' => $password,
        ]);
    }

    public function register(string $username, string $email, string $password): Response
    {
        return Http::post("{$this->baseUrl}/register", [
            'username' => $username,
            'email' => $email,
            'password' => $password,
        ]);
    }

    public function forgotPassword(string $email): Response
    {
        return Http::post("{$this->baseUrl}/forgot-password", [
            'email' => $email,
        ]);
    }

    public function resetPassword(string $token, string $newPassword): Response
    {
        return Http::post("{$this->baseUrl}/reset-password", [
            'token' => $token,
            'new_password' => $newPassword,
        ]);
    }

    public function me(string $token): Response
    {
        return Http::withToken($token)->get("{$this->baseUrl}/me");
    }
}
