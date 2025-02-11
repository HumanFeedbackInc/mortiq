import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Admin dashboard for managing application data',
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen">
      <div className="flex">
        {/* Sidebar
        <aside className="w-64 min-h-screen bg-white border-r">
          Add sidebar content
        </aside> */}

        {/* Main content */}
        <main className="flex-1">
          {/* Header */}
          {/* <header className="h-16 border-b px-4 flex items-center"> */}
            {/* Add header content */}
          {/* </header> */}

          {/* Page content */}
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
