<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RedirectIfAgent
{
    /**
     * Redirect authenticated agents away from guest-only agent routes (login, register).
     * Allow admins and unauthenticated users to access the agent login page.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->user() && $request->user()->hasRole('agent')) {
            return redirect()->route('agent.dashboard');
        }

        return $next($request);
    }
}
