"use client"
import React from 'react'
import { useAuth } from '@/hooks/UserAuth'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut } from 'lucide-react'

const UserMenu = () => {
    const { user, logout } = useAuth();

    return (
        <div className="ml-auto flex items-center gap-2">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon"
                        className="relative cursor-pointer rounded-full bg-gradient-to-r from-gray-500 to-gray-500 text-white font-bold h-10 w-10 shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                    >
                        <p className="text-lg">{user?.name?.charAt(0) ?? 'U'}</p>
                        <span className="sr-only">User menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-2 border border-gray-200 dark:border-gray-700">
                    <DropdownMenuLabel className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        My Account
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-600" />
                    <DropdownMenuGroup>
                        <DropdownMenuItem className="text-gray-700 dark:text-gray-200 font-medium py-2 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                            {user?.name ?? 'Unknown User'}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-gray-700 dark:text-gray-200 font-medium py-2 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                            {user?.email ?? 'No email'}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={logout}
                            className="group flex items-center justify-center gap-2 mt-2 py-3 px-4 bg-gray-600 text-white font-semibold rounded-mdfocus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 transform cursor-pointer"
                        >
                            <LogOut className="h-4 w-4 text-white" />
                            Logout
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

export default UserMenu