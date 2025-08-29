import { NextRequest, NextResponse } from 'next/server'

interface CognitoApp {
  id: number
  appKey: string
  appName: string
  awsRegion: string
  userPoolId: string
  clientId: string
  enabled: boolean
}

export async function GET() {
  try {
    const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:8080'
    const response = await fetch(`${apiBaseUrl}/api/admin/apps`, {
      method: 'GET',
      headers: {
        'Accept': '*/*',
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    // Extract the data array from the backend response structure
    const apps: CognitoApp[] = result.data || result
    return NextResponse.json(apps)
  } catch (error) {
    console.error('Error fetching apps:', error)
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const appData = await request.json()
    
    const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:8080'
    const response = await fetch(`${apiBaseUrl}/api/admin/apps`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(appData),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const newApp: CognitoApp = await response.json()
    return NextResponse.json(newApp)
  } catch (error) {
    console.error('Error creating app:', error)
    return NextResponse.json(
      { error: 'Failed to create application' },
      { status: 500 }
    )
  }
}