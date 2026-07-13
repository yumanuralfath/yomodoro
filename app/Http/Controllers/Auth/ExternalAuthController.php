<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Services\AuthApiService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ExternalAuthController extends Controller
{
    public function __construct(protected AuthApiService $authApi) {}

    public function showLogin()
    {
        return Inertia::render('auth/Login');
    }

    public function login(Request $request)
    {
        $data = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $response = $this->authApi->login($data['email'], $data['password']);

        if ($response->failed()) {
            return back()->withErrors([
                'email' => $response->json('error', 'Login gagal, periksa kembali email/password.'),
            ]);
        }

        $payload = $response->json('data');

        session([
            'auth_token' => $payload['access_token'],
            'auth_user' => $payload['user'],
        ]);

        return redirect()->route('dashboard');
    }

    public function showRegister()
    {
        return Inertia::render('auth/Register');
    }

    public function register(Request $request)
    {
        $data = $request->validate([
            'username' => ['required', 'string'],
            'email' => ['required', 'email'],
            'password' => ['required', 'string', 'min:8'],
        ]);

        $response = $this->authApi->register($data['username'], $data['email'], $data['password']);

        if ($response->failed()) {
            return back()->withErrors([
                'email' => $response->json('error', 'Registrasi gagal.'),
            ]);
        }

        return redirect()->route('register.success', ['email' => $data['email']]);
    }

    public function showRegisterSuccess(Request $request)
    {
        return Inertia::render('auth/RegisterSuccess', [
            'email' => $request->query('email'),
        ]);
    }

    public function showForgotPassword()
    {
        return Inertia::render('auth/ForgotPassword');
    }

    public function forgotPassword(Request $request)
    {
        $data = $request->validate(['email' => ['required', 'email']]);

        $response = $this->authApi->forgotPassword($data['email']);

        if ($response->failed()) {
            return back()->withErrors([
                'email' => $response->json('error', 'Forgot password request failed.'),
            ]);
        }

        return back()->with('status', $response->json('message', 'Link reset password sudah dikirim ke email kamu.'));
    }

    public function showResetPassword(Request $request)
    {
        return Inertia::render('auth/ResetPassword', [
            'token' => $request->query('token'),
        ]);
    }

    public function resetPassword(Request $request)
    {
        $data = $request->validate([
            'token' => ['required', 'string'],
            'password' => ['required', 'string', 'min:8'],
        ]);

        $response = $this->authApi->resetPassword($data['token'], $data['password']);

        if ($response->failed()) {
            return back()->withErrors([
                'password' => $response->json('error', 'Reset password gagal.'),
            ]);
        }

        return redirect()->route('login')->with('status', $response->json('message', 'Password berhasil direset, silakan login.'));
    }

    public function logout(Request $request)
    {
        $request->session()->forget(['auth_token', 'auth_user']);
        return redirect()->route('login');
    }
}
