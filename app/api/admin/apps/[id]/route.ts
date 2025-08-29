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

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const appData = await request.json()
    const appId = params.id
    
    const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:8080'
    const response = await fetch(`${apiBaseUrl}/api/admin/apps/${appId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(appData),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const updatedApp: CognitoApp = await response.json()
    return NextResponse.json(updatedApp)
  } catch (error) {
    console.error('Error updating app:', error)
    return NextResponse.json(
      { error: 'Failed to update application' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const appId = params.id
    
    const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:8080'
    const response = await fetch(`${apiBaseUrl}/api/admin/apps/${appId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting app:', error)
    return NextResponse.json(
      { error: 'Failed to delete application' },
      { status: 500 }
    )
  }
}