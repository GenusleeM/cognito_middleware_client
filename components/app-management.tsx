"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Plus, Settings, Power, PowerOff, Trash2, Edit, Search, MoreHorizontal, Loader2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AppForm } from "./app-form"
import { useToast } from "@/hooks/use-toast"

interface CognitoApp {
  id: number
  appKey: string
  appName: string
  awsRegion: string
  userPoolId: string
  clientId: string
  enabled: boolean
}

export function AppManagement() {
  const [apps, setApps] = useState<CognitoApp[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editingApp, setEditingApp] = useState<CognitoApp | null>(null)
  const [formLoading, setFormLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState<number | null>(null)
  const [confirmAction, setConfirmAction] = useState<{
    app: CognitoApp
    action: "enable" | "disable"
  } | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<CognitoApp | null>(null)

  const { toast } = useToast()

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const response = await fetch('/api/admin/apps')
        if (!response.ok) {
          throw new Error('Failed to fetch applications')
        }
        const apps = await response.json()
        setApps(apps)
      } catch (error) {
        console.error('Error fetching apps:', error)
        toast({
          title: "Error",
          description: "Failed to load applications. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchApps()
  }, [])

  const filteredApps = apps.filter(
    (app) =>
      (app.appName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (app.awsRegion?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (app.userPoolId?.toLowerCase() || '').includes(searchTerm.toLowerCase()),
  )

  const handleAddApp = async (appData: any) => {
    setFormLoading(true)
    try {
      const response = await fetch('/api/admin/apps', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appData),
      })

      if (!response.ok) {
        throw new Error('Failed to create application')
      }

      const newApp = await response.json()
      setApps((prev) => [...prev, newApp])
      setShowAddDialog(false)

      toast({
        title: "Application created",
        description: `${appData.appName} has been successfully created.`,
      })
    } catch (error) {
      console.error("Error adding app:", error)
      toast({
        title: "Error",
        description: "Failed to create application. Please try again.",
        variant: "destructive",
      })
    } finally {
      setFormLoading(false)
    }
  }

  const handleEditApp = async (appData: any) => {
    if (!editingApp) return

    setFormLoading(true)
    try {
      const response = await fetch(`/api/admin/apps/${editingApp.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appData),
      })

      if (!response.ok) {
        throw new Error('Failed to update application')
      }

      const updatedApp = await response.json()
      setApps((prev) => prev.map((app) => (app.id === editingApp.id ? updatedApp : app)))
      setEditingApp(null)

      toast({
        title: "Application updated",
        description: `${appData.appName} has been successfully updated.`,
      })
    } catch (error) {
      console.error("Error updating app:", error)
      toast({
        title: "Error",
        description: "Failed to update application. Please try again.",
        variant: "destructive",
      })
    } finally {
      setFormLoading(false)
    }
  }

  const handleToggleApp = async (app: CognitoApp, action: "enable" | "disable") => {
    setActionLoading(app.id)
    try {
      const response = await fetch(`/api/admin/apps/${app.id}/${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to ${action} application`)
      }

      setApps((prev) => prev.map((a) => (a.id === app.id ? { ...a, enabled: action === "enable" } : a)))

      toast({
        title: `Application ${action}d`,
        description: `${app.appName || 'Application'} has been successfully ${action}d.`,
      })
    } catch (error) {
      console.error(`Error ${action}ing app:`, error)
      toast({
        title: "Error",
        description: `Failed to ${action} application. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setActionLoading(null)
      setConfirmAction(null)
    }
  }

  const handleDeleteApp = async (app: CognitoApp) => {
    setActionLoading(app.id)
    try {
      const response = await fetch(`/api/admin/apps/${app.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to delete application')
      }

      setApps((prev) => prev.filter((a) => a.id !== app.id))

      toast({
        title: "Application deleted",
        description: `${app.appName || 'Application'} has been permanently deleted.`,
      })
    } catch (error) {
      console.error("Error deleting app:", error)
      toast({
        title: "Error",
        description: "Failed to delete application. Please try again.",
        variant: "destructive",
      })
    } finally {
      setActionLoading(null)
      setDeleteConfirm(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-full bg-primary animate-pulse"></div>
          <span className="text-muted-foreground">Loading applications...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
            {apps.length} Applications
          </Badge>
          <Badge variant="outline" className="border-primary/20">
            {apps.filter((app) => app.enabled).length} Active
          </Badge>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Add Application
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <AppForm onSubmit={handleAddApp} onCancel={() => setShowAddDialog(false)} isLoading={formLoading} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search applications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Applications</CardTitle>
          <CardDescription>Manage your AWS Cognito user pools and application configurations</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredApps.length === 0 && searchTerm ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No applications found matching "{searchTerm}"</p>
            </div>
          ) : filteredApps.length === 0 ? (
            <div className="text-center py-12">
              <Settings className="h-12 w-12 text-muted-foreground mb-4 mx-auto" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No Applications Found</h3>
              <p className="text-muted-foreground text-center mb-6 max-w-md mx-auto">
                Get started by adding your first AWS Cognito application configuration.
              </p>
              <Button className="bg-primary hover:bg-primary/90" onClick={() => setShowAddDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Application
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Application</TableHead>
                    <TableHead>Region</TableHead>
                    <TableHead>User Pool ID</TableHead>
                    <TableHead>Client ID</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApps.map((app) => (
                    <TableRow key={app.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{app.appName || 'Unnamed App'}</div>
                          <div className="text-xs text-muted-foreground font-mono">{app.appKey?.slice(0, 8) || 'N/A'}...</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono text-xs">
                          {app.awsRegion || 'N/A'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <code className="text-xs bg-muted px-2 py-1 rounded">{app.userPoolId || 'N/A'}</code>
                      </TableCell>
                      <TableCell>
                        <code className="text-xs bg-muted px-2 py-1 rounded">{app.clientId?.slice(0, 12) || 'N/A'}...</code>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={app.enabled ? "default" : "secondary"}
                            className={app.enabled ? "bg-primary" : ""}
                          >
                            {app.enabled ? "Active" : "Disabled"}
                          </Badge>
                          {actionLoading === app.id && (
                            <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" disabled={actionLoading === app.id}>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setEditingApp(app)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                setConfirmAction({
                                  app,
                                  action: app.enabled ? "disable" : "enable",
                                })
                              }
                            >
                              {app.enabled ? (
                                <>
                                  <PowerOff className="h-4 w-4 mr-2" />
                                  Disable
                                </>
                              ) : (
                                <>
                                  <Power className="h-4 w-4 mr-2" />
                                  Enable
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive" onClick={() => setDeleteConfirm(app)}>
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editingApp} onOpenChange={() => setEditingApp(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {editingApp && (
            <AppForm
              app={editingApp}
              onSubmit={handleEditApp}
              onCancel={() => setEditingApp(null)}
              isLoading={formLoading}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog for Enable/Disable Actions */}
      <AlertDialog open={!!confirmAction} onOpenChange={() => setConfirmAction(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{confirmAction?.action === "enable" ? "Enable" : "Disable"} Application</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to {confirmAction?.action} "{confirmAction?.app.appName || 'this application'}"?
              {confirmAction?.action === "disable" && (
                <span className="block mt-2 text-orange-600 font-medium">
                  This will prevent users from authenticating through this application.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => confirmAction && handleToggleApp(confirmAction.app, confirmAction.action)}
              className={
                confirmAction?.action === "disable"
                  ? "bg-orange-600 hover:bg-orange-700"
                  : "bg-primary hover:bg-primary/90"
              }
            >
              {confirmAction?.action === "enable" ? "Enable" : "Disable"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Confirmation Dialog for Delete Actions */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive">Delete Application</AlertDialogTitle>
            <AlertDialogDescription>
              <div className="space-y-3">
                <p>Are you sure you want to permanently delete "{deleteConfirm?.appName || 'this application'}"?</p>
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                  <p className="text-destructive font-medium text-sm">
                    ⚠️ This action cannot be undone. This will permanently:
                  </p>
                  <ul className="text-destructive text-sm mt-2 space-y-1 list-disc list-inside">
                    <li>Remove the application configuration</li>
                    <li>Disable all authentication for this app</li>
                    <li>Delete all associated settings and keys</li>
                  </ul>
                </div>
                <p className="text-sm text-muted-foreground">
                  App Key: <code className="bg-muted px-1 rounded">{deleteConfirm?.appKey || 'N/A'}</code>
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteConfirm && handleDeleteApp(deleteConfirm)}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete Permanently
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
