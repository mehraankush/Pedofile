"use client"
import React from 'react'

type SidebarProviderProps = {
    children: React.ReactNode
}

const SidebarProvider = ({ children }: SidebarProviderProps) => {
    return (
        <>{children}</>
    )
}

export default SidebarProvider
