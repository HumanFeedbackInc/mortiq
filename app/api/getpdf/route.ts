// app/api/get-pdf-url/route.ts
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Authenticate user
    const cookieStore = cookies()
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: () => cookieStore }
    )

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
        console.log("authError")
        console.log(authError)
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Generate signed URL
    const adminClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!
    )

    const { data, error } = await adminClient.storage
      .from('secureFiles')
      .createSignedUrl('./dealsheet.pdf', 3600)

    if (error) {
      throw error
    }

    return NextResponse.json({ url: data.signedUrl })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate PDF URL' },
      { status: 500 }
    )
  }
}