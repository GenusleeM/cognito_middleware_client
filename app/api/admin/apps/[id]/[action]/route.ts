import { NextRequest, NextResponse } from 'next/server'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string; action: string } }
) {
  try {
    const appId = params.id
    const action = params.action
    
    // Validate action
    if (action !== 'enable' && action !== 'disable') {
      return NextResponse.json(
        { error: 'Invalid action. Must be "enable" or "disable"' },
        { status: 400 }
      )
    }
    
    const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:8080'
    const response = await fetch(`${apiBaseUrl}/api/admin/apps/${appId}/${action}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    return NextResponse.json(result)
  } catch (error) {
    console.error(`Error ${params.action}ing app:`, error)
    return NextResponse.json(
      { error: `Failed to ${params.action} application` },
      { status: 500 }
    )
  }
}