"use client"

import type React from "react"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { z } from "zod"
import { Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"


const passwordSchema = z
    .object({
        password: z
            .string()
            .min(8, { message: "Password must be at least 8 characters" })
            .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
            .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
            .regex(/[0-9]/, { message: "Password must contain at least one number" }),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    })

export default function ResetPasswordPage() {
    
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState("")
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

    const token = useSearchParams().get("token")

    const validatePassword = () => {
        try {
            passwordSchema.parse({ password, confirmPassword })
            setValidationErrors({})
            return true
        } catch (err) {
            if (err instanceof z.ZodError) {
                const errors: Record<string, string> = {}
                err.errors.forEach((error) => {
                    if (error.path) {
                        errors[error.path[0]] = error.message
                    }
                })
                setValidationErrors(errors)
            }
            return false
        }
    }

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        if (!validatePassword()) return

        if (!token) {
            setError("Invalid or missing reset token")
            return
        }

        setIsLoading(true)

        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                body: JSON.stringify({ token, password }),
                headers: { "Content-Type": "application/json" },
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.message || "Failed to reset password")
            }

            setSuccess(true)
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unexpected error occurred")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-gray-50">
            <Card className="w-full max-w-md">
                {success ? (
                    <CardContent className="pt-6">
                        <div className="flex flex-col items-center justify-center space-y-4 text-center">
                            <CheckCircle className="h-16 w-16 text-green-500" />
                            <CardTitle className="text-2xl font-semibold text-green-700">Password Reset Successful!</CardTitle>
                            <CardDescription className="text-base">
                                Your password has been successfully reset. You can now log in with your new password.
                            </CardDescription>
                            <Button className="mt-4 w-full" onClick={() => (window.location.href = "/login")}>
                                Go to Login
                            </Button>
                        </div>
                    </CardContent>
                ) : (
                    <>
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold text-center">Reset Your Password</CardTitle>
                            <CardDescription className="text-center">Please enter your new password below</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleReset} className="space-y-4">
                                {error && (
                                    <Alert variant="destructive">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertDescription>{error}</AlertDescription>
                                    </Alert>
                                )}

                                <div className="space-y-2">
                                    <Label htmlFor="password">New Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter your new password"
                                        className={validationErrors.password ? "border-red-500" : ""}
                                    />
                                    {validationErrors.password && <p className="text-sm text-red-500">{validationErrors.password}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Confirm your new password"
                                        className={validationErrors.confirmPassword ? "border-red-500" : ""}
                                    />
                                    {validationErrors.confirmPassword && (
                                        <p className="text-sm text-red-500">{validationErrors.confirmPassword}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <p className="text-xs text-gray-500">
                                        Password must be at least 8 characters and include uppercase, lowercase, and numbers.
                                    </p>
                                </div>

                                <CardFooter className="px-0 pt-4">
                                    <Button type="submit" className="w-full" disabled={isLoading}>
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Resetting Password...
                                            </>
                                        ) : (
                                            "Reset Password"
                                        )}
                                    </Button>
                                </CardFooter>
                                <CardFooter className="flex flex-col space-y-4 mt-3">
                                    <div className="text-center text-sm">
                                        Remember your password?{" "}
                                        <Link href="/login" className="text-primary underline">
                                            Back to login
                                        </Link>
                                    </div>
                                </CardFooter>
                            </form>
                        </CardContent>
                    </>
                )}
            </Card>
        </div>
    )
}
