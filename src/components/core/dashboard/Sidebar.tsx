"use client"
import React from 'react'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { useAuth } from '@/hooks/UserAuth'
import { usePathname } from 'next/navigation'
import { FileText, Home, LogOut, User } from "lucide-react"

const DashboardSidebar = () => {

    const { logout } = useAuth();
    const pathname = usePathname();

    return (
        <Sidebar>
            <SidebarHeader>
                <Link href="/">
                    <div className="flex items-center gap-2 px-2 py-3">
                        <FileText className="h-6 w-6 text-primary" />
                        <span className="text-xl font-bold">Pedofile</span>
                    </div>
                </Link>
            </SidebarHeader>
            <SidebarContent>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={pathname === "/dashboard"}>
                            <Link href="/dashboard">
                                <Home className="mr-2 h-4 w-4" />
                                <span>Dashboard</span>
                            </Link>
                        </SidebarMenuButton>
                        <SidebarMenuButton asChild isActive={pathname === "/profile"}>
                            <Link href="/profile">
                                <User className="mr-2 h-4 w-4" />
                                <span>Profile</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <div onClick={logout} className='cursor-pointer'>
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Logout</span>
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}

export default DashboardSidebar