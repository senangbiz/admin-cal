import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function AgentLogin() {
  const { data, setData, post, processing, errors } = useForm({
    email: '',
    password: '',
    remember: false,
  });

  function onSubmit(e) {
    e.preventDefault();
    post('/agent/login');
  }

  return (
    <>
      <Head title="Agent Login" />
      <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-semibold">Agent Sign In</CardTitle>
            <CardDescription>
              Sign in with your agent account to continue
            </CardDescription>
          </CardHeader>
          <form onSubmit={onSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  value={data.email}
                  onChange={(e) => setData('email', e.target.value)}
                  aria-invalid={!!errors.email}
                />
                {errors.email && (
                  <p className="text-sm text-destructive" role="alert">
                    {errors.email}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  value={data.password}
                  onChange={(e) => setData('password', e.target.value)}
                  aria-invalid={!!errors.password}
                />
                {errors.password && (
                  <p className="text-sm text-destructive" role="alert">
                    {errors.password}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="remember"
                  checked={data.remember}
                  onChange={(e) => setData('remember', e.target.checked)}
                  className="h-4 w-4 rounded border-input"
                />
                <Label htmlFor="remember" className="font-normal text-sm">
                  Remember me
                </Label>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4 mt-3">
              <Button type="submit" className="w-full" disabled={processing}>
                {processing ? 'Signing in…' : 'Sign in'}
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                Don&apos;t have an agent account?{' '}
                <Link
                  href="/agent/register"
                  className="text-primary font-medium underline-offset-4 hover:underline"
                >
                  Register
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </>
  );
}
