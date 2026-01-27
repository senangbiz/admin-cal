<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ config('app.name', 'Laravel') }}</title>
    <style>
        body {
            font-family: system-ui, -apple-system, sans-serif;
            margin: 0;
            padding: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            background-color: #f5f5f5;
        }
        .container {
            text-align: center;
            max-width: 600px;
            padding: 2rem;
        }
        h1 {
            font-size: 2.5rem;
            margin-bottom: 1rem;
            color: #333;
        }
        p {
            font-size: 1.125rem;
            color: #666;
            margin-bottom: 2rem;
        }
        nav {
            display: flex;
            gap: 1rem;
            justify-content: center;
            flex-wrap: wrap;
        }
        a {
            padding: 0.75rem 1.5rem;
            text-decoration: none;
            border-radius: 0.375rem;
            transition: background-color 0.2s;
        }
        .btn-primary {
            background-color: #333;
            color: white;
        }
        .btn-primary:hover {
            background-color: #555;
        }
        .btn-secondary {
            background-color: white;
            color: #333;
            border: 1px solid #ddd;
        }
        .btn-secondary:hover {
            background-color: #f9f9f9;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Welcome</h1>
        <p>Welcome to {{ config('app.name', 'Laravel') }}</p>
        
        @if (Route::has('login'))
            <nav>
                @auth
                    <a href="{{ url('/dashboard') }}" class="btn-primary">Dashboard</a>
                @else
                    <a href="{{ route('login') }}" class="btn-secondary">Log in</a>
                    @if (Route::has('register'))
                        <a href="{{ route('register') }}" class="btn-primary">Register</a>
                    @endif
                @endauth
            </nav>
        @endif
    </div>
</body>
</html>
