'use client'

import { useState } from 'react'
import { useBuilderStore } from '@/features/builder/store/builder-store'
import { exportToPDF, exportToICS } from '@/features/export/lib/export-service'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FileJson, FileText, Calendar, QrCode, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { toast } from 'sonner'

export function ExportDialog() {
  const { selectedCourses } = useBuilderStore()
  const [exporting, setExporting] = useState(false)

  const handleExportPDF = async () => {
    if (selectedCourses.length === 0) {
      toast.error('Add courses before exporting')
      return
    }
    
    setExporting(true)
    try {
      await exportToPDF(selectedCourses, `schedule-${new Date().toISOString().slice(0, 10)}.pdf`)
      toast.success('Schedule exported as PDF')
    } catch (error) {
      toast.error('Failed to export PDF')
      console.error(error)
    } finally {
      setExporting(false)
    }
  }

  const handleExportICS = async () => {
    if (selectedCourses.length === 0) {
      toast.error('Add courses before exporting')
      return
    }
    
    setExporting(true)
    try {
      await exportToICS(selectedCourses, `schedule-${new Date().toISOString().slice(0, 10)}.ics`)
      toast.success('Schedule exported to calendar')
    } catch (error) {
      toast.error('Failed to export calendar')
      console.error(error)
    } finally {
      setExporting(false)
    }
  }

  const handleExportJSON = () => {
    if (selectedCourses.length === 0) {
      toast.error('Add courses before exporting')
      return
    }
    
    const data = JSON.stringify(selectedCourses, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `schedule-${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    toast.success('Schedule exported as JSON')
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Export Schedule</CardTitle>
          <CardDescription>
            Download your schedule in various formats
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {selectedCourses.length === 0 && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No courses selected. Build a schedule first to export.
              </AlertDescription>
            </Alert>
          )}

          <Tabs defaultValue="pdf" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="pdf">PDF</TabsTrigger>
              <TabsTrigger value="calendar">Calendar</TabsTrigger>
              <TabsTrigger value="json">JSON</TabsTrigger>
            </TabsList>

            <TabsContent value="pdf" className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Export your schedule as a printable PDF document
              </p>
              <Button 
                onClick={handleExportPDF} 
                disabled={selectedCourses.length === 0 || exporting}
                className="w-full"
              >
                <FileText className="w-4 h-4 mr-2" />
                {exporting ? 'Exporting...' : 'Export as PDF'}
              </Button>
            </TabsContent>

            <TabsContent value="calendar" className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Export to Google Calendar, Apple Calendar, or Outlook
              </p>
              <Button 
                onClick={handleExportICS} 
                disabled={selectedCourses.length === 0 || exporting}
                className="w-full"
              >
                <Calendar className="w-4 h-4 mr-2" />
                {exporting ? 'Exporting...' : 'Export to Calendar'}
              </Button>
            </TabsContent>

            <TabsContent value="json" className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Export as JSON for integration or backup
              </p>
              <Button 
                onClick={handleExportJSON} 
                disabled={selectedCourses.length === 0}
                className="w-full"
              >
                <FileJson className="w-4 h-4 mr-2" />
                Export as JSON
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
