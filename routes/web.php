<?php

use App\Http\Controllers\Agent\AuthController as AgentAuthController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome');
});

// Agent auth (guest)
Route::middleware('guest')->prefix('agent')->name('agent.')->group(function () {
    Route::get('login', [AgentAuthController::class, 'showLoginForm'])->name('login');
    Route::post('login', [AgentAuthController::class, 'login']);
    Route::get('register', [AgentAuthController::class, 'showRegisterForm'])->name('register');
    Route::post('register', [AgentAuthController::class, 'register']);

    // OTP verification
    Route::get('otp/verify', [AgentAuthController::class, 'showOtpForm'])->name('otp.verify');
    Route::post('otp/verify', [AgentAuthController::class, 'verifyOtp']);
    Route::post('otp/resend', [AgentAuthController::class, 'resendOtp'])->name('otp.resend');
});

// Agent dashboard (auth)
Route::middleware(['auth'])->prefix('agent')->name('agent.')->group(function () {
    Route::post('logout', [AgentAuthController::class, 'logout'])->name('logout');
    Route::get('dashboard', function () {
        return Inertia::render('Agent/Dashboard');
    })->name('dashboard');
});
