"use client"

import { LoginForm } from "@/components/login-form"
import { useAuth } from "@/contexts/auth-context"
import { Loader2 } from "lucide-react"
import type React from "react"
import { Fragment } from "react"

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    return <LoginForm />
  }

  return <Fragment>{children}</Fragment>
}
