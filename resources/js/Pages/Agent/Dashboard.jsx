import { Head, Link } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { CarLoanCalculator } from '@/components/car-loan-calculator'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ThemeToggle } from '@/components/theme-provider'

export default function AgentDashboard({ agentBrands = [], carTypesByBrand = {}, profileData = {} }) {
  const hasBrands = agentBrands?.length > 0

  return (
    <>
      <Head title="Agent Dashboard - Loan Calculator" />
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-2 flex justify-end items-center gap-2">
          <ThemeToggle />
          <Button variant="outline" size="sm" asChild>
            <Link href="/agent/logout" method="post" as="button">
              Sign out
            </Link>
          </Button>
        </div>
        {hasBrands ? (
          <CarLoanCalculator
            agentBrands={agentBrands}
            carTypesByBrand={carTypesByBrand}
            profileData={profileData}
            designStorageKey="agent-loan-calc-design"
          />
        ) : (
          <main className="container mx-auto px-4 py-12 flex justify-center">
            <Card className="max-w-md w-full bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">No brands assigned</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Your account does not have any brands assigned yet. Contact your administrator to get access to the loan calculator.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Once brands are assigned to your agent profile, you will see the car loan calculator here with the correct logo and models.
                </p>
              </CardContent>
            </Card>
          </main>
        )}
      </div>
    </>
  )
}
