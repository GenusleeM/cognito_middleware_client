import { AppManagement } from "@/components/app-management"

export default function AdminPortal() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">OM</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-primary">Old Mutual</span>
                  <span className="text-sm text-muted-foreground">|</span>
                </div>
                <h1 className="text-xl font-bold text-foreground">Cognito Admin Portal</h1>
                <p className="text-sm text-muted-foreground">Manage AWS Cognito Applications</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse"></div>
              <span className="text-sm text-muted-foreground">Connected</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">Application Management</h2>
          <p className="text-muted-foreground">Manage your AWS Cognito user pools and application configurations</p>
        </div>

        <AppManagement />
      </main>
    </div>
  )
}
