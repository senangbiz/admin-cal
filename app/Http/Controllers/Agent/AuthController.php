<?php

namespace App\Http\Controllers\Agent;

use App\Http\Controllers\Controller;
use App\Mail\OTPMail;
use App\Models\Agent;
use App\Models\Brand;
use App\Models\Otp;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class AuthController extends Controller
{
    public function showLoginForm()
    {
        return Inertia::render('Agent/Login');
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'string', 'email'],
            'password' => ['required'],
        ]);

        if (! Auth::attempt($credentials, $request->boolean('remember'))) {
            return back()->withErrors([
                'email' => __('auth.failed'),
            ])->onlyInput('email');
        }

        $request->session()->regenerate();

        $user = Auth::user();
        $agentRole = Role::where('slug', 'agent')->first();

        if (! $agentRole || ! $user->hasRole('agent')) {
            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return back()->withErrors([
                'email' => 'Only agent accounts can sign in here.',
            ])->onlyInput('email');
        }

        return redirect()->intended(route('agent.dashboard'));
    }

    public function showRegisterForm()
    {
        $brands = Brand::where('is_active', true)->orderBy('name')->get(['id', 'name']);

        return Inertia::render('Agent/Register', [
            'brands' => $brands,
        ]);
    }

    public function register(Request $request)
    {
        $validated = $request->validate([
            // Step 1 - User
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'confirmed', Password::defaults()],
            // Step 2 - Agent
            'phone' => ['required', 'string', 'max:50'],
            'profile_photo' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif,webp', 'max:2048'],
            'showroom_location' => ['required', 'string', 'max:255'],
            'coverage_areas' => ['required', 'array', 'min:1'],
            'coverage_areas.*' => ['string', 'max:255'],
            'brand_id' => ['required', 'integer', 'exists:brands,id'],
        ]);

        $agentRole = Role::where('slug', 'agent')->first();
        if (! $agentRole) {
            return back()->withErrors(['email' => 'Agent role not configured.'])->withInput();
        }

        // Handle profile photo upload
        $profilePhotoPath = null;
        if ($request->hasFile('profile_photo')) {
            $profilePhotoPath = $request->file('profile_photo')->store('agents/photos', 'public');
        }

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        $user->roles()->attach($agentRole->id);

        $agent = Agent::create([
            'user_id' => $user->id,
            'phone' => $validated['phone'] ?? null,
            'profile_photo' => $profilePhotoPath,
            'showroom_location' => $validated['showroom_location'] ?? null,
            'coverage_areas' => $validated['coverage_areas'] ?? null,
            'is_active' => false, // Inactive until OTP verified
        ]);

        // Attach single brand
        $agent->brands()->attach($validated['brand_id'], ['is_active' => true]);

        // Generate and send OTP
        $otp = Otp::generate($user, 'email_verification');

        Mail::to($user->email)->send(new OTPMail($otp));

        // Store user ID in session for OTP verification
        $request->session()->put('otp_user_id', $user->id);

        return redirect()->route('agent.otp.verify');
    }

    public function showOtpForm()
    {
        if (! session()->has('otp_user_id')) {
            return redirect()->route('agent.register');
        }

        $user = User::find(session('otp_user_id'));

        return Inertia::render('Agent/VerifyOtp', [
            'email' => $user?->email,
        ]);
    }

    public function verifyOtp(Request $request)
    {
        $request->validate([
            'code' => ['required', 'string', 'size:6'],
        ]);

        $userId = session('otp_user_id');
        if (! $userId) {
            return redirect()->route('agent.register');
        }

        $user = User::find($userId);
        if (! $user) {
            return redirect()->route('agent.register');
        }

        $otp = Otp::where('user_id', $user->id)
            ->where('type', 'email_verification')
            ->where('code', $request->code)
            ->where('expires_at', '>', now())
            ->where('used_at', null)
            ->first();

        if (! $otp) {
            return back()->withErrors(['code' => 'Invalid or expired OTP code.']);
        }

        // Mark OTP as used
        $otp->update(['used_at' => now()]);

        // Mark user as verified
        $user->update(['email_verified_at' => now()]);

        // Activate agent
        $user->agent?->update(['is_active' => true]);

        // Clear session and login
        session()->forget('otp_user_id');
        Auth::login($user);
        $request->session()->regenerate();

        return redirect()->route('agent.dashboard');
    }

    public function resendOtp(Request $request)
    {
        $userId = session('otp_user_id');
        if (! $userId) {
            return redirect()->route('agent.register');
        }

        $user = User::find($userId);
        if (! $user) {
            return redirect()->route('agent.register');
        }

        // Invalidate previous OTPs
        Otp::where('user_id', $user->id)
            ->where('type', 'email_verification')
            ->whereNull('used_at')
            ->update(['used_at' => now()]);

        // Generate new OTP
        $otp = Otp::generate($user, 'email_verification');

        Mail::to($user->email)->send(new OTPMail($otp));

        return back()->with('message', 'A new OTP has been sent to your email.');
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('agent.login');
    }
}
