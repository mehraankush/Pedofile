import type React from "react"
import {
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import DashboardSidebar from "@/components/core/dashboard/Sidebar"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import UserMenu from "@/components/core/dashboard/UserMenu"

export default async function DashboardLayout({
    children
}: { children: React.ReactNode }) {
    
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
        redirect('/login')
    }

    return (
        <SidebarProvider defaultOpen={true}>
            <div className="flex min-h-screen w-full">

                <DashboardSidebar />
                <div className="flex-1 w-full">
                    <div className="flex h-16 items-center border-b px-4 md:px-6">
                        <SidebarTrigger />
                        <UserMenu />
                    </div>
                    <div className="p-4 md:p-6">{children}</div>
                </div>
            </div>
        </SidebarProvider>
    )
}
