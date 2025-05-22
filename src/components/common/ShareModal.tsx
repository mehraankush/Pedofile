"use client"

import { useEffect, useState } from "react"
import { Check, Copy, Mail, Globe, Link2 } from "lucide-react"
import { Facebook, Twitter, Linkedin, Share2, MessageCircle } from "lucide-react"

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
import type { PdfDocumentType } from "@/types/global"
import { cn } from "@/lib/utils"

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
    const [isCopied, setIsCopied] = useState(false)
    const [privateUrl, setPrivateUrl] = useState("")
    const [invitedEmail, setInvitedEmail] = useState<string | null>(null)

    useEffect(() => {
        if (pdf?.isPublic) {
            setPublicUrl(`${process.env.NEXT_PUBLIC_BASE_URL}/shared/${pdf._id}`)
        }
    }, [pdf?.isPublic, pdf?._id])

    const handleMakePublic = async () => {
        setIsGeneratingLink(true)
        console.log("calling pblic")

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
        navigator.clipboard.writeText(privateUrl || publicUrl)
        setIsCopied(true)
        toast.success("Public link has been copied to clipboard")

        // Reset the copied state after 2 seconds
        setTimeout(() => {
            setIsCopied(false)
        }, 2000)
    }

    const handleSendInvite = async () => {
        if (!emailInvite) {
            toast.error("Please enter an email address")
            return
        }
        console.log("calling personal")
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
            setInvitedEmail(emailInvite)
            setEmailInvite("")

            setPrivateUrl(`${process.env.NEXT_PUBLIC_BASE_URL}/shared/${pdf._id}`)
           
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
                        <DialogTitle className="text-xl font-semibold">{`Share ${pdf.title}`}</DialogTitle>
                    </div>
                    <DialogDescription className="text-sm text-muted-foreground">
                        Generate a link to share this PDF with others or send an email invitation.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium flex items-center gap-2">
                            <Globe className="h-4 w-4" />
                            Share via Link
                        </h3>
                        {publicUrl ? (
                            <div className="space-y-2">
                                <div className="flex gap-2">
                                    <Input value={publicUrl} readOnly className="flex-1 bg-muted/50 focus-visible:ring-1" />
                                    <Button onClick={handleCopyLink} variant="secondary" className="transition-all duration-200">
                                        {isCopied ? (
                                            <>
                                                <Check className="mr-2 h-4 w-4 text-green-500" />
                                                Copied
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="mr-2 h-4 w-4" />
                                                Copy
                                            </>
                                        )}
                                    </Button>
                                </div>
                                <p className="text-xs text-muted-foreground">Anyone with this link can view this document</p>
                            </div>
                        ) : (
                            <Button onClick={handleMakePublic} disabled={isGeneratingLink} className="w-full" size="lg">
                                <Link2 className="mr-2 h-4 w-4" />
                                {isGeneratingLink ? "Generating..." : "Generate Public Link"}
                            </Button>
                        )}
                    </div>

                    <Separator className="my-6" />

                    <div className="space-y-4">
                        <h3 className="text-lg font-medium flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            Share via Email
                        </h3>
                        <div className="space-y-4">
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
                                        className="focus-visible:ring-1"
                                    />
                                </div>
                                <Button
                                    onClick={handleSendInvite}
                                    disabled={isSendingInvite}
                                    className={cn("w-full sm:w-auto transition-all duration-200", isSendingInvite && "opacity-80")}
                                >
                                    {isSendingInvite ? "Sending..." : "Send Invite"}
                                </Button>
                            </div>

                            {invitedEmail && privateUrl && (
                                <div className="rounded-md bg-muted/50 p-3 text-sm">
                                    <p className="font-medium text-green-600 mb-1 flex items-center gap-1">
                                        <Check className="h-4 w-4" />
                                        Invitation sent to {invitedEmail}
                                    </p>
                                    <p className="text-muted-foreground text-xs">
                                        They can also access the document directly via this link:
                                    </p>
                                    <div className="mt-2 flex items-center gap-2">
                                        <Input value={privateUrl} readOnly className="flex-1 h-8 text-xs bg-background/80" />
                                        <Button onClick={handleCopyLink} variant="ghost" size="sm" className="h-8 px-2">
                                            {isCopied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <Separator className="my-6" />

                    <div className="space-y-4">
                        <h3 className="text-lg font-medium flex items-center gap-2">
                            <Share2 className="h-4 w-4" />
                            Share on Social Media
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <Button
                                variant="outline"
                                className="flex flex-col items-center justify-center h-20 p-2"
                                onClick={() => {
                                    if (!publicUrl) {
                                        toast.error("Please generate a public link first")
                                        return
                                    }
                                    window.open(
                                        `https://wa.me/?text=${encodeURIComponent(`Check out this PDF: ${pdf.title} ${publicUrl}`)}`,
                                        "_blank",
                                    )
                                }}
                            >
                                <MessageCircle className="h-6 w-6 mb-1 text-green-600" />
                                <span className="text-xs">WhatsApp</span>
                            </Button>
                            <Button
                                variant="outline"
                                className="flex flex-col items-center justify-center h-20 p-2"
                                onClick={() => {
                                    if (!publicUrl) {
                                        toast.error("Please generate a public link first")
                                        return
                                    }
                                    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(publicUrl)}`, "_blank")
                                }}
                            >
                                <Facebook className="h-6 w-6 mb-1 text-blue-600" />
                                <span className="text-xs">Facebook</span>
                            </Button>
                            <Button
                                variant="outline"
                                className="flex flex-col items-center justify-center h-20 p-2"
                                onClick={() => {
                                    if (!publicUrl) {
                                        toast.error("Please generate a public link first")
                                        return
                                    }
                                    window.open(
                                        `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out this PDF: ${pdf.title}`)}&url=${encodeURIComponent(publicUrl)}`,
                                        "_blank",
                                    )
                                }}
                            >
                                <Twitter className="h-6 w-6 mb-1 text-blue-400" />
                                <span className="text-xs">Twitter</span>
                            </Button>
                            <Button
                                variant="outline"
                                className="flex flex-col items-center justify-center h-20 p-2"
                                onClick={() => {
                                    if (!publicUrl) {
                                        toast.error("Please generate a public link first")
                                        return
                                    }
                                    window.open(
                                        `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(publicUrl)}`,
                                        "_blank",
                                    )
                                }}
                            >
                                <Linkedin className="h-6 w-6 mb-1 text-blue-700" />
                                <span className="text-xs">LinkedIn</span>
                            </Button>
                        </div>
                        {!publicUrl && (
                            <p className="text-sm text-muted-foreground">Generate a public link first to enable social sharing</p>
                        )}
                    </div>
                </div>

                <DialogFooter className="flex justify-between sm:justify-end gap-2 pt-2">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={onClose}>Done</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
