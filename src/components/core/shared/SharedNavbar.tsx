"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/UserAuth"
import UserMenu from "../dashboard/UserMenu"
import { ArrowLeft, Download, MessageSquare } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"


const SharedNavbar = ({ commentLength, setShowDetails, title, showDetails }: {
    commentLength?: number,
    setShowDetails: (showDetails: boolean) => void,
    title: string,
    showDetails: boolean
}) => {

    const router = useRouter();
    const { user } = useAuth();

    return (
        <header className="border-b sticky top-0 bg-white z-10">
            <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.push("/dashboard")}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <ArrowLeft className="h-5 w-5" />
                        <span className="sr-only">Back to dashboard</span>
                    </Button>
                    <h1 className="text-lg font-medium truncate">{title}</h1>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" onClick={() => setShowDetails(!showDetails)}>
                        {showDetails ? "Hide Details" : "Show Details"}
                    </Button>
                    <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                    </Button>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="secondary" size="sm">
                                    <MessageSquare className="mr-2 h-4 w-4" />
                                    Comments ({commentLength || 0})
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Comments are currently disabled</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    {user && <UserMenu />}
                </div>
            </div>
        </header>

    )
}

export default SharedNavbar