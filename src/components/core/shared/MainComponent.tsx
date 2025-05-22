"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ExternalLink } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent } from "@/components/ui/card"
import { useGetSharedDocumentById } from "@/services/pdf"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import CommentComponent from "../comments/CommentComponent"
import { useGetComments } from "@/services/Comment"
import { ApiError } from "@/services/apiCalls"
import SharedNavbar from "./SharedNavbar"


export default function PDFViewerPage({ id }: { id: string }) {
    const {
        data,
        isLoading,
        isError,
        error,
    } = useGetSharedDocumentById(id)
    const router = useRouter();

    // const [comments, setComments] = useState(MOCK_COMMENTS)
    const [isCommentsOpen, setIsCommentsOpen] = useState(true)
    const [showDetails, setShowDetails] = useState(false)
    const {
        data: comments,
        //  isLoading:isCommentLoading
    } = useGetComments(id)


    if (isError) {
        const apiError = error as ApiError;
        if (apiError.status === 401) {
            return (
                <div className="flex items-center justify-center h-screen">
                    <div className="text-center">
                        <h2 className="text-xl font-semibold mb-2">Unauthorized</h2>
                        <p className="text-muted-foreground">You are not authorized to view this document</p>
                        <p className="text-muted-foreground">
                            {` Try logging in with the correct account, or sign up if you don't have one.`}
                        </p>

                        <Button className="mt-4" onClick={() => router.push("/dashboard")}>
                            Return to Dashboard
                        </Button>
                    </div>
                </div>
            )
        } else if (apiError.status === 403) {
            return (
                <div className="flex items-center justify-center h-screen">
                    <div className="text-center">
                        <h2 className="text-xl font-semibold mb-2">Forbidden</h2>
                        <p className="text-muted-foreground">You do not have permission to view this document</p>
                        <Button className="mt-4" onClick={() => router.push("/dashboard")}>
                            Return to Dashboard
                        </Button>
                    </div>
                </div>
            )
        }
        else {
            return (
                <div className="flex items-center justify-center h-screen">
                    <div className="text-center">
                        <h2 className="text-xl font-semibold mb-2">Error</h2>
                        <p className="text-muted-foreground">An error occurred while fetching the document</p>
                        <Button className="mt-4" onClick={() => router.push("/dashboard")}>
                            Return to Dashboard
                        </Button>
                    </div>
                </div>
            )
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="w-12 h-12 border-4 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }


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


            <SharedNavbar
                commentLength={comments?.length || 0}
                setShowDetails={setShowDetails}
                title={data.title}
                showDetails={showDetails}
            />

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
                                loading="lazy"
                            ></iframe>
                        </div>
                    </div>
                </div>

                {isCommentsOpen && (
                    <CommentComponent
                        documentId={id}
                        comments={comments}
                        setIsCommentsOpen={setIsCommentsOpen}
                    />
                )}

            </main>
        </div>
    )
}
