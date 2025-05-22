"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { FileText } from 'lucide-react'

import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { useAuth } from "@/hooks/UserAuth"


export default function LoginPage() {

  const { user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })



  const redirectPath = searchParams.get('redirect') || '/dashboard'

  useEffect(() => {
    if (user) {
      router.replace(redirectPath)
    }
  }, [user])

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (!formData.email || !formData.password) {
      toast.error("Please enter both email and password")
      return
    }

    setIsLoading(true)

    try {

      const res = await fetch("/api/auth/login", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      if (!res.ok) {
        throw new Error("Invalid email or password")
      }

      const data = await res.json();
      console.log("data", data)

      // For demo purposes, let's accept any login
      toast.success("You have successfully logged in",)

      router.push("/dashboard")
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
        toast.error(error.message);
      } else {
        setError("Something went wrong");
        toast.error("Something went wrong");
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleForgotPassword = () => {
    toast.success("If your email is registered, you will receive a password reset link.")
  }

  return (
    <>
      <div className="flex min-h-screen flex-col">

        <div className=" flex flex-col flex-1 items-center justify-center py-12">

          <Card className="w-full max-w-md">
            {error && (
              <div className="p-3 text-center  text-sm rounded-md bg-red-50 text-red-500 dark:bg-red-900/20 dark:text-red-300 border border-red-100 dark:border-red-900/30 capitalize">
                {error}
              </div>
            )}
            <CardHeader className="space-y-1">
              <div className="flex items-center justify-center mb-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-6 w-6 text-primary" />
                  <span className="text-xl font-bold">PedoFile</span>
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-center">Login to your account</CardTitle>
              <CardDescription className="text-center">
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Button
                      variant="link"
                      className="p-0 h-auto text-sm"
                      type="button"
                      onClick={handleForgotPassword}
                    >
                      Forgot password?
                    </Button>
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4 mt-3">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
                <div className="text-center text-sm">
                  Don&apos;t have an account?{" "}
                  <Link href="/signup" className="text-primary underline">
                    Sign up
                  </Link>
                </div>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </>
  )
}
