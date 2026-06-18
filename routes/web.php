<?php

use App\Http\Controllers\Agent\AuthController as AgentAuthController;
use App\Http\Controllers\Agent\DashboardController as AgentDashboardController;
use App\Http\Middleware\RedirectIfAgent;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Agent login is the welcome page
Route::middleware(RedirectIfAgent::class)->group(function () {
    Route::get('/', [AgentAuthController::class, 'showLoginForm'])->name('agent.login');
    Route::get('/login', fn () => redirect('/'))->name('login');
});

// Agent auth (only redirect if already logged in as agent; admins can access)
Route::middleware(RedirectIfAgent::class)->prefix('agent')->name('agent.')->group(function () {
    Route::redirect('login', '/');
    Route::post('login', [AgentAuthController::class, 'login']);
    Route::get('register', [AgentAuthController::class, 'showRegisterForm'])->name('register');
    Route::post('register', [AgentAuthController::class, 'register']);
});

// Agent dashboard (auth)
Route::middleware(['auth'])->prefix('agent')->name('agent.')->group(function () {
    Route::post('logout', [AgentAuthController::class, 'logout'])->name('logout');
    Route::get('dashboard', AgentDashboardController::class)->name('dashboard');
});
