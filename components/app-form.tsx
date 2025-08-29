"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Save, X } from "lucide-react"

interface CognitoApp {
  id?: number
  appKey?: string
  appName: string
  awsRegion: string
  userPoolId: string
  clientId: string
  clientSecret: string
  enabled?: boolean
}

interface AppFormProps {
  app?: CognitoApp
  onSubmit: (app: Omit<CognitoApp, "id" | "appKey" | "enabled">) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

const AWS_REGIONS = [
  { value: "us-east-1", label: "US East (N. Virginia)" },
  { value: "us-east-2", label: "US East (Ohio)" },
  { value: "us-west-1", label: "US West (N. California)" },
  { value: "us-west-2", label: "US West (Oregon)" },
  { value: "eu-west-1", label: "Europe (Ireland)" },
  { value: "eu-west-2", label: "Europe (London)" },
  { value: "eu-west-3", label: "Europe (Paris)" },
  { value: "eu-central-1", label: "Europe (Frankfurt)" },
  { value: "ap-southeast-1", label: "Asia Pacific (Singapore)" },
  { value: "ap-southeast-2", label: "Asia Pacific (Sydney)" },
  { value: "ap-northeast-1", label: "Asia Pacific (Tokyo)" },
  { value: "ap-south-1", label: "Asia Pacific (Mumbai)" },
]

export function AppForm({ app, onSubmit, onCancel, isLoading = false }: AppFormProps) {
  const [formData, setFormData] = useState<Omit<CognitoApp, "id" | "appKey" | "enabled">>({
    appName: app?.appName || "",
    awsRegion: app?.awsRegion || "",
    userPoolId: app?.userPoolId || "",
    clientId: app?.clientId || "",
    clientSecret: app?.clientSecret || "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.appName.trim()) {
      newErrors.appName = "Application name is required"
    }

    if (!formData.awsRegion) {
      newErrors.awsRegion = "AWS region is required"
    }

    if (!formData.userPoolId.trim()) {
      newErrors.userPoolId = "User Pool ID is required"
    } else if (!formData.userPoolId.match(/^[a-z0-9-]+_[a-zA-Z0-9]+$/)) {
      newErrors.userPoolId = "Invalid User Pool ID format"
    }

    if (!formData.clientId.trim()) {
      newErrors.clientId = "Client ID is required"
    }

    if (!formData.clientSecret.trim()) {
      newErrors.clientSecret = "Client secret is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      await onSubmit(formData)
    } catch (error) {
      console.error("Form submission error:", error)
    }
  }

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>{app ? "Edit Application" : "Add New Application"}</CardTitle>
        <CardDescription>
          {app ? "Update the AWS Cognito application configuration" : "Configure a new AWS Cognito application"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="appName">Application Name</Label>
              <Input
                id="appName"
                value={formData.appName}
                onChange={(e) => handleInputChange("appName", e.target.value)}
                placeholder="MyApp"
                className={errors.appName ? "border-destructive" : ""}
                disabled={isLoading}
              />
              {errors.appName && <p className="text-sm text-destructive">{errors.appName}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="awsRegion">AWS Region</Label>
              <Select
                value={formData.awsRegion}
                onValueChange={(value) => handleInputChange("awsRegion", value)}
                disabled={isLoading}
              >
                <SelectTrigger className={errors.awsRegion ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  {AWS_REGIONS.map((region) => (
                    <SelectItem key={region.value} value={region.value}>
                      {region.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.awsRegion && <p className="text-sm text-destructive">{errors.awsRegion}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="userPoolId">User Pool ID</Label>
            <Input
              id="userPoolId"
              value={formData.userPoolId}
              onChange={(e) => handleInputChange("userPoolId", e.target.value)}
              placeholder="us-east-1_abcdefghi"
              className={`font-mono ${errors.userPoolId ? "border-destructive" : ""}`}
              disabled={isLoading}
            />
            {errors.userPoolId && <p className="text-sm text-destructive">{errors.userPoolId}</p>}
            <p className="text-xs text-muted-foreground">Format: region_identifier (e.g., us-east-1_abcdefghi)</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="clientId">Client ID</Label>
            <Input
              id="clientId"
              value={formData.clientId}
              onChange={(e) => handleInputChange("clientId", e.target.value)}
              placeholder="1234567890abcdefghijklmnop"
              className={`font-mono ${errors.clientId ? "border-destructive" : ""}`}
              disabled={isLoading}
            />
            {errors.clientId && <p className="text-sm text-destructive">{errors.clientId}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="clientSecret">Client Secret</Label>
            <Input
              id="clientSecret"
              type="password"
              value={formData.clientSecret}
              onChange={(e) => handleInputChange("clientSecret", e.target.value)}
              placeholder="Enter client secret"
              className={errors.clientSecret ? "border-destructive" : ""}
              disabled={isLoading}
            />
            {errors.clientSecret && <p className="text-sm text-destructive">{errors.clientSecret}</p>}
            <p className="text-xs text-muted-foreground">
              This will be stored securely and used for API authentication
            </p>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-border">
            <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {app ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {app ? "Update Application" : "Create Application"}
                </>
              )}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
