import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function AgentDashboard() {
  return (
    <>
      <Head title="Agent Dashboard" />
      <div className="min-h-screen bg-muted/30">
        <header className="border-b bg-card">
          <div className="container flex h-14 items-center justify-between px-4">
            <h1 className="font-semibold">Agent Dashboard</h1>
            <Link href="/agent/logout" method="post" as="button">
              <Button variant="outline" size="sm">
                Sign out
              </Button>
            </Link>
          </div>
        </header>
        <main className="container px-4 py-8">
          <Card>
            <CardHeader>
              <CardTitle>Welcome</CardTitle>
              <CardDescription>
                You are signed in as an agent. This is your dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                More content can be added here later.
              </p>
            </CardContent>
          </Card>
        </main>
      </div>
    </>
  );
}
