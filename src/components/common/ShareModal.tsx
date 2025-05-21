"use client"

import { useEffect, useState } from "react"
import { Copy, Mail, Globe } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Separator } from "@/components/ui/separator"
import { PdfDocumentType } from "@/types/global"


export function SharePdfDialog({
    isOpen,
    onClose,
    pdf,
}: {
    isOpen: boolean
    onClose: () => void
    pdf: PdfDocumentType
}) {
    const [publicUrl, setPublicUrl] = useState("")
    const [emailInvite, setEmailInvite] = useState("")
    const [isGeneratingLink, setIsGeneratingLink] = useState(false)
    const [isSendingInvite, setIsSendingInvite] = useState(false)


    useEffect(() => {
        if (pdf?.isPublic) {
            setPublicUrl(`${process.env.NEXT_PUBLIC_BASE_URL}/shared/${pdf._id}`)
        }
    }, [pdf?.isPublic])

    const handleMakePublic = async () => {
        setIsGeneratingLink(true)

        try {
            const response = await fetch("/api/share", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    shareType: "public",
                    documentId: pdf._id,
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || "Failed to make document public")
            }

            setPublicUrl(data.publicUrl)
            toast.success("Document is now public and can be shared")
        } catch (error) {
            console.error("Error making document public:", error)
            toast.error(error instanceof Error ? error.message : "Failed to make document public")
        } finally {
            setIsGeneratingLink(false)
        }
    }

    const handleCopyLink = () => {
        navigator.clipboard.writeText(publicUrl)
        toast.success("Public link has been copied to clipboard")
    }

    const handleSendInvite = async () => {
        if (!emailInvite) {
            toast.error("Please enter an email address")
            return
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(emailInvite)) {
            toast.error("Please enter a valid email address")
            return
        }

        setIsSendingInvite(true)

        try {
            const response = await fetch("/api/share", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    shareType: "individual",
                    email: emailInvite,
                    documentId: pdf._id,
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || "Failed to share document")
            }

            toast.success(`Document shared successfully with ${emailInvite}`)
            setEmailInvite("")
        } catch (error) {
            console.error("Error sharing document:", error)
            toast.error(error instanceof Error ? error.message : "Failed to share document")
        } finally {
            setIsSendingInvite(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader className="space-y-3">
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-xl font-semibold">Share {pdf.title}</DialogTitle>
                    </div>
                    <DialogDescription className="text-sm text-muted-foreground">
                        Generate a link to share this PDF with others or send an email invitation.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">Share via Link</h3>
                        {publicUrl ? (
                            <div className="flex gap-2">
                                <Input value={publicUrl} readOnly className="flex-1" />
                                <Button onClick={handleCopyLink} variant="secondary">
                                    <Copy className="mr-2 h-4 w-4" />
                                    Copy
                                </Button>
                            </div>
                        ) : (
                            <Button onClick={handleMakePublic} disabled={isGeneratingLink} className="w-full sm:w-auto" size="lg">
                                <Globe className="mr-2 h-4 w-4" />
                                {isGeneratingLink ? "Generating..." : "Generate Public Link"}
                            </Button>
                        )}
                    </div>

                    <Separator />

                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">Share via Email</h3>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <div className="flex-1">
                                <Label htmlFor="email-invite" className="sr-only">
                                    Email
                                </Label>
                                <Input
                                    id="email-invite"
                                    placeholder="Enter email address"
                                    type="email"
                                    value={emailInvite}
                                    onChange={(e) => setEmailInvite(e.target.value)}
                                />
                            </div>
                            <Button onClick={handleSendInvite} disabled={isSendingInvite} className="w-full sm:w-auto">
                                <Mail className="mr-2 h-4 w-4" />
                                {isSendingInvite ? "Sending..." : "Send"}
                            </Button>
                        </div>
                    </div>
                </div>

                <DialogFooter className="flex justify-between sm:justify-end gap-2">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={onClose}>Done</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
