'use client'

import { useState } from 'react'
import { BulkImport } from '@/features/import/components/bulk-import'
import { AdminLogin } from '@/features/import/components/admin-login'
import { isAdminAuthenticated, clearAdminSession } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'

export default function ImportPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(isAdminAuthenticated())

  const handleLogout = () => {
    clearAdminSession()
    setIsAuthenticated(false)
  }

  if (!isAuthenticated) {
    return <AdminLogin onSuccess={() => setIsAuthenticated(true)} />
  }

  return (
    <div className="space-y-4 md:space-y-6 px-3 md:px-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Import Routine</h1>
          <p className="text-sm md:text-base text-muted-foreground mt-2">
            Automatically populate your schedule by uploading a file with your course routine
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="mt-2"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
      <BulkImport />
    </div>
  )
}
