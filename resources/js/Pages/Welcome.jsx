import { ThemeToggle } from '@/components/theme-provider';

export default function Welcome() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background dark:bg-background">
            <div className="absolute top-4 right-4">
                <ThemeToggle />
            </div>
            <div className="text-center max-w-2xl px-8">
                <h1 className="text-4xl font-bold text-foreground mb-4">
                    Welcome
                </h1>
                <p className="text-lg text-muted-foreground mb-8">
                    You're running Laravel with Inertia.js and React.
                </p>
                <nav className="flex gap-4 justify-center flex-wrap">
                    <a
                        href="/admin"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition"
                    >
                        Admin Panel
                    </a>
                    <a
                        href="/agent/login"
                        className="px-6 py-3 border border-border rounded-lg font-medium bg-card hover:bg-muted transition text-foreground"
                    >
                        Agent Login
                    </a>
                </nav>
            </div>
        </div>
    );
}
