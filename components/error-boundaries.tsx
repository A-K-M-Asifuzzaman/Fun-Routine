'use client'

import { ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: (error: Error) => ReactNode
}

interface ErrorBoundaryState {
  error: Error | null
}

export class SearchErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        this.props.fallback?.(this.state.error) || (
          <div className="p-4 text-destructive">
            Search temporarily unavailable
          </div>
        )
      )
    }

    return this.props.children
  }
}

export class TimetableErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        this.props.fallback?.(this.state.error) || (
          <div className="p-4 text-destructive">
            Timetable rendering error
          </div>
        )
      )
    }

    return this.props.children
  }
}

export class ExportErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        this.props.fallback?.(this.state.error) || (
          <div className="p-4 text-destructive">
            Export failed. Please try again.
          </div>
        )
      )
    }

    return this.props.children
  }
}
}

import React from 'react'
