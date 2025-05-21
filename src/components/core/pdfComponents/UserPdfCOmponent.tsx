"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Download, MessageSquare, Send, User, ExternalLink } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useGetPdfById } from "@/services/pdf"

// Mock data for comments
const MOCK_COMMENTS = [
    {
        id: "1",
        user: { name: "John Doe", email: "john@example.com" },
        content: "This looks great! I especially like the approach outlined on page 2.",
        createdAt: "2025-05-16T10:30:00Z",
    },
    {
        id: "2",
        user: { name: "Jane Smith", email: "jane@example.com" },
        content: "I think we should add more details about the budget in section 3.",
        createdAt: "2025-05-16T11:45:00Z",
    },
    {
        id: "3",
        user: { name: "Alex Johnson", email: "alex@example.com" },
        content: "Can we schedule a meeting to discuss the timeline?",
        createdAt: "2025-05-17T09:15:00Z",
    },
]


export default function UserPdfCOmponent({ id }: { id: string }) {
    const router = useRouter()
    const { data, isLoading } = useGetPdfById(id)

    const [comments, setComments] = useState(MOCK_COMMENTS)
    const [newComment, setNewComment] = useState("")
    const [isCommentsOpen, setIsCommentsOpen] = useState(true)
    const [showDetails, setShowDetails] = useState(false)

    const handleAddComment = () => {
        if (!newComment.trim()) return

        const comment = {
            id: String(comments.length + 1),
            user: { name: "Current User", email: "user@example.com" },
            content: newComment,
            createdAt: new Date().toISOString(),
        }

        setComments([...comments, comment])
        setNewComment("")
    }


    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleString()
    }
    
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="w-12 h-12 border-4 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    console.log("data inside pdf ", data, id)

    if (!data) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <h2 className="text-xl font-semibold mb-2">PDF not found</h2>
                    <p className="text-muted-foreground">The requested document could not be found</p>
                    <Button className="mt-4" onClick={() => router.push("/dashboard")}>
                        Return to Dashboard
                    </Button>
                </div>
            </div>
        )
    }


    return (
        <div className="flex flex-col min-h-screen ">

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
                        <h1 className="text-lg font-medium truncate">{data.title}</h1>
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
                                        Comments ({3})
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Comments are currently disabled</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>
            </header>

            <main className="flex-1 flex">

                <div className="flex flex-col gap-5 w-full  ">

                    <div className="flex-1 p-4 md:p-6 lg:p-8 ">
                        {showDetails && (
                            <Card className="mb-6 max-w-3xl mx-auto">
                                <CardContent className="pt-6">
                                    <div className="grid gap-3">
                                        <div className="grid grid-cols-3 gap-2">
                                            <span className="font-medium text-sm">File ID:</span>
                                            <span className="col-span-2 text-sm break-all">{data.fileId}</span>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2">
                                            <span className="font-medium text-sm">Document ID:</span>
                                            <span className="col-span-2 text-sm break-all">{data._id}</span>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2">
                                            <span className="font-medium text-sm">Send Email:</span>
                                            <span className="col-span-2">
                                                <Badge variant={data.sendEmail ? "default" : "secondary"} className="text-xs">
                                                    {data.sendEmail ? "Yes" : "No"}
                                                </Badge>
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2">
                                            <span className="font-medium text-sm">Shared With:</span>
                                            <div className="col-span-2">
                                                {data.sharedWith.length > 0 ? (
                                                    data.sharedWith.map((id: string) => (
                                                        <Badge key={id} variant="outline" className="mr-1 mb-1 text-xs">
                                                            {id}
                                                        </Badge>
                                                    ))
                                                ) : (
                                                    <span className="text-sm text-muted-foreground">Not shared with anyone</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <Separator className="my-4" />
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium text-sm">File URL:</span>
                                        <Button variant="outline" size="sm" onClick={() => window.open(data.fileUrl, "_blank")}>
                                            <ExternalLink className="mr-2 h-4 w-4" />
                                            Open in new tab
                                        </Button>
                                    </div>
                                    <div className="mt-2 p-2 bg-muted rounded-md break-all">
                                        <code className="text-xs">{data.fileUrl}</code>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        <div className="max-w-4xl mx-auto bg-white shadow-sm rounded-lg overflow-hidden border">
                            {/* owner info */}
                            <div className="bg-gray-50 border-b">
                                <div className=" px-4 sm:px-6 py-3 flex items-center justify-between ">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-8 w-8 border">
                                            <AvatarFallback>{data.owner.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="font-medium text-sm">{data.owner.name}</div>
                                            <div className="text-xs text-muted-foreground">{data.owner.email}</div>
                                        </div>
                                    </div>
                                    <Badge variant={data.isPublic ? "default" : "secondary"}>{data.isPublic ? "Public" : "Private"}</Badge>
                                </div>
                            </div>
                            {/* PDF Embed */}
                            <iframe
                                src={data.fileUrl.replace("view?usp=drivesdk", "preview")}
                                className="w-full h-[calc(100vh-200px)] border-0 p-5"
                                title={data.title}
                                allow="autoplay"
                                allowFullScreen
                                allowTransparency
                                loading="lazy"
                            ></iframe>
                        </div>
                    </div>
                </div>

                {isCommentsOpen && (
                    <div className="w-full md:w-[500px] bg-background border-l z-10 flex flex-col">
                        <div className="p-4 border-b flex items-center justify-between">
                            <h2 className="font-medium">Comments ({comments.length})</h2>
                            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsCommentsOpen(false)}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="h-4 w-4"
                                >
                                    <path d="M18 6 6 18" />
                                    <path d="m6 6 12 12" />
                                </svg>
                            </Button>
                        </div>
                        <div className="flex-1 overflow-auto p-4">
                            {comments.length === 0 ? (
                                <div className="text-center py-8">
                                    <MessageSquare className="h-8 w-8 mx-auto text-muted-foreground/60 mb-2" />
                                    <p className="text-muted-foreground">No comments yet</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {comments.map((comment) => (
                                        <div key={comment.id} className="bg-muted/50 rounded-lg p-3">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                                    <User className="h-4 w-4" />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-sm">{comment.user.name}</div>
                                                    <div className="text-xs text-muted-foreground">{formatDate(comment.createdAt)}</div>
                                                </div>
                                            </div>
                                            <p className="text-sm">{comment.content}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="p-4 border-t">
                            <div className="flex gap-2">
                                <Textarea
                                    placeholder="Add a comment..."
                                    className="min-h-[80px]"
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                />
                                <Button
                                    size="icon"
                                    className="h-10 w-10 shrink-0 self-end"
                                    onClick={handleAddComment}
                                    disabled={!newComment.trim()}
                                >
                                    <Send className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

            </main>
        </div>
    )
}
