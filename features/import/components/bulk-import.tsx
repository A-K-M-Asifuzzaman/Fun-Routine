'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { parseCSV, parseJSON, parseExcel, validateImport, convertToClassEntry } from '@/features/import/lib/import-service'
import { Upload, AlertCircle, CheckCircle2, FileUp, Download } from 'lucide-react'
import { toast } from 'sonner'
import type { ImportedCourse } from '@/features/import/lib/import-service'

export function BulkImport() {
  const [isLoading, setIsLoading] = useState(false)
  const [importedCourses, setImportedCourses] = useState<ImportedCourse[]>([])
  const [errors, setErrors] = useState<string[]>([])
  const [step, setStep] = useState<'upload' | 'review' | 'confirm'>('upload')

  const handleFileUpload = async (file: File) => {
    setIsLoading(true)
    setErrors([])
    
    try {
      let courses: ImportedCourse[] = []
      const content = await file.text()

      if (file.name.endsWith('.csv')) {
        courses = await parseCSV(content)
      } else if (file.name.endsWith('.json')) {
        courses = await parseJSON(content)
      } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        const buffer = await file.arrayBuffer()
        courses = await parseExcel(buffer)
      } else {
        // Try CSV as default
        courses = await parseCSV(content)
      }

      const validation = validateImport(courses)
      if (!validation.valid) {
        setErrors(validation.errors)
        setImportedCourses([])
        toast.error('Validation failed. Check the errors below.')
        return
      }

      setImportedCourses(courses)
      setStep('review')
      toast.success(`Imported ${courses.length} courses`)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to parse file'
      setErrors([message])
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleConfirm = async () => {
    setIsLoading(true)
    try {
      // Convert and store in localStorage temporarily
      const classEntries = importedCourses.map(imported => {
        const entry = convertToClassEntry(imported)
        return {
          id: `${imported.day}-${imported.courseCode}-${imported.room}-${entry.startMinutes}`
            .replace(/\s+/g, '-')
            .toLowerCase(),
          ...entry,
        }
      })

      // Save to localStorage
      localStorage.setItem('imported_classes', JSON.stringify(classEntries))
      
      toast.success(`Successfully imported ${classEntries.length} classes!`)
      setStep('confirm')
      
      // Reset after 2 seconds
      setTimeout(() => {
        setImportedCourses([])
        setStep('upload')
      }, 2000)
    } catch (error) {
      toast.error('Failed to import classes')
    } finally {
      setIsLoading(false)
    }
  }

  const downloadTemplate = () => {
    const template = `course,section,day,start time,end time,room,instructor,type
CSE 111,1,Monday,9:00,10:30,101,Dr. Smith,Theory
CSE 111,1,Tuesday,10:30,12:00,Lab Block,Dr. Smith,Lab
CSE 112,1,Wednesday,11:00,12:30,102,Dr. Johnson,Theory
CSE 112,2,Thursday,14:00,15:30,103,Dr. Brown,Theory`

    const blob = new Blob([template], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'routine-template.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      {(step === 'upload' || step === 'confirm') && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileUp className="w-5 h-5" />
              Bulk Import Routine
            </CardTitle>
            <CardDescription>
              Upload a CSV, JSON, or Excel file to automatically populate your entire schedule
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Upload Area */}
            <div
              onDrop={(e) => {
                e.preventDefault()
                const file = e.dataTransfer.files[0]
                if (file) handleFileUpload(file)
              }}
              onDragOver={(e) => e.preventDefault()}
              className="border-2 border-dashed rounded-lg p-12 text-center hover:bg-muted/50 transition-colors cursor-pointer"
            >
              <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
              <p className="font-medium">Drag and drop your file here</p>
              <p className="text-sm text-muted-foreground mt-1">or click to browse</p>
              <input
                type="file"
                accept=".csv,.json,.xlsx,.xls"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleFileUpload(file)
                }}
                className="hidden"
                id="file-input"
              />
              <label htmlFor="file-input" className="block mt-4">
                <Button variant="outline" type="button" disabled={isLoading}>
                  {isLoading ? 'Processing...' : 'Select File'}
                </Button>
              </label>
            </div>

            {/* Template Download */}
            <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
              <p className="text-sm font-medium mb-2">Need help with the format?</p>
              <Button variant="outline" size="sm" onClick={downloadTemplate}>
                Download CSV Template
              </Button>
            </div>

            {/* File Format Info */}
            <div className="bg-muted p-4 rounded-lg space-y-2 text-sm">
              <p className="font-medium">Supported columns:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li><span className="font-medium">course</span> - Course code (e.g., CSE 111)</li>
                <li><span className="font-medium">section</span> - Section number (1, 2, etc.)</li>
                <li><span className="font-medium">day</span> - Day of week (Monday, Tuesday, etc.)</li>
                <li><span className="font-medium">start time</span> - Start time (HH:MM format)</li>
                <li><span className="font-medium">end time</span> - End time (HH:MM format)</li>
                <li><span className="font-medium">room</span> - Room number</li>
                <li><span className="font-medium">instructor</span> - Instructor name</li>
                <li><span className="font-medium">type</span> - Theory or Lab</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Review Section */}
      {step === 'review' && importedCourses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Review Imported Courses</CardTitle>
            <CardDescription>
              {importedCourses.length} courses ready to import
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Total Courses</p>
                <p className="text-2xl font-bold">{importedCourses.length}</p>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Unique Days</p>
                <p className="text-2xl font-bold">
                  {new Set(importedCourses.map(c => c.day)).size}
                </p>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Semesters</p>
                <p className="text-2xl font-bold">
                  {new Set(importedCourses.map(c => c.semester || 1)).size}
                </p>
              </div>
            </div>

            {/* Course List */}
            <div className="max-h-96 overflow-y-auto border rounded-lg">
              <table className="w-full text-sm">
                <thead className="bg-muted sticky top-0">
                  <tr>
                    <th className="p-3 text-left">Course</th>
                    <th className="p-3 text-left">Day</th>
                    <th className="p-3 text-left">Time</th>
                    <th className="p-3 text-left">Room</th>
                    <th className="p-3 text-left">Type</th>
                  </tr>
                </thead>
                <tbody>
                  {importedCourses.map((course, idx) => (
                    <tr key={idx} className="border-t hover:bg-muted/50">
                      <td className="p-3 font-medium">{course.courseCode}.{course.section}</td>
                      <td className="p-3">{course.day}</td>
                      <td className="p-3">{course.startTime}-{course.endTime}</td>
                      <td className="p-3">{course.room}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          course.type === 'Lab' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        }`}>
                          {course.type}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Errors if any */}
            {errors.length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="w-4 h-4" />
                <AlertDescription>
                  <div className="space-y-1">
                    {errors.map((error, idx) => (
                      <p key={idx} className="text-sm">{error}</p>
                    ))}
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setStep('upload')
                  setImportedCourses([])
                  setErrors([])
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={isLoading || importedCourses.length === 0}
                className="flex-1"
              >
                {isLoading ? 'Importing...' : 'Confirm & Import'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Success Section */}
      {step === 'confirm' && (
        <Card className="border-green-200 dark:border-green-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
              <CheckCircle2 className="w-5 h-5" />
              Import Successful!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Your routine has been imported successfully. The application will automatically use your imported data.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Errors Display */}
      {errors.length > 0 && step !== 'review' && (
        <Alert variant="destructive">
          <AlertCircle className="w-4 h-4" />
          <AlertDescription>
            <div className="space-y-1">
              {errors.map((error, idx) => (
                <p key={idx}>{error}</p>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
