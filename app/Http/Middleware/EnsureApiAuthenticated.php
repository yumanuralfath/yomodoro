<?php

namespace App\Http\Middleware;

use App\Services\AuthApiService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureApiAuthenticated
{
    public function __construct(protected AuthApiService $authApi) {}

    public function handle(Request $request, Closure $next): Response
    {
        $token = session('auth_token');

        if (! $token) {
            return redirect()->route('login');
        }

        $response = $this->authApi->me($token);

        if ($response->failed()) {
            $request->session()->forget(['auth_token', 'auth_user']);
            return redirect()->route('login');
        }

        session(['auth_user' => $response->json('data')]);

        return $next($request);
    }
}
