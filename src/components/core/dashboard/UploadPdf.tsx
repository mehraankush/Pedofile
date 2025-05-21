"use client"

import { toast } from "sonner"
import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription,
} from "@/components/ui/dialog"
import { Plus, Search, Upload } from "lucide-react"

interface UploadPdfProps {
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>
    searchQuery: string
}

const UploadPdf: React.FC<UploadPdfProps> = ({  setSearchQuery, searchQuery }) => {
    const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [isUploading, setIsUploading] = useState(false)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]

            // Check if file is a PDF
            if (file.type !== "application/pdf") {
                toast.error("Please upload a PDF file")
                return
            }

            setSelectedFile(file)
        }
    }

    const handleUpload = async () => {
        if (!selectedFile) {
            toast.error("Please select a PDF file to upload")
            return
        }

        setIsUploading(true)

        try {
            const formData = new FormData()
            formData.append("file", selectedFile)

            const response = await fetch("/api/pdf/upload", {
                method: "POST",
                body: formData,
            })

            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.error || "Failed to upload file")
            }

            toast.success("Success")

            setIsUploadDialogOpen(false)
            setSelectedFile(null)
        } catch (error) {
            console.log("error", error)
            toast.error("Failed to upload PDF. Please try again.")
        } finally {
            setIsUploading(false)
        }
    }

    return (
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
            <h1 className="text-3xl font-bold">My PDFs</h1>

            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search PDFs..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="w-full sm:w-auto">
                            <Plus className="mr-2 h-4 w-4" />
                            Upload PDF
                        </Button>
                    </DialogTrigger>

                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Upload PDF</DialogTitle>
                            <DialogDescription>
                                Upload a PDF file to your collection. The file must be in PDF format.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <label htmlFor="pdf-upload" className="cursor-pointer">
                                    <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-2 text-center">
                                        <Upload className="h-8 w-8 text-muted-foreground" />
                                        <p className="font-medium">Click to select a PDF file</p>
                                        <p className="text-sm text-muted-foreground">
                                            {selectedFile ? selectedFile.name : "PDF files only"}
                                        </p>
                                    </div>
                                    <input
                                        id="pdf-upload"
                                        type="file"
                                        accept="application/pdf"
                                        className="hidden"
                                        onChange={handleFileChange}
                                    />
                                </label>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button className="cursor-pointer" variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button className="cursor-pointer" onClick={handleUpload} disabled={!selectedFile || isUploading}>
                                {isUploading ? "Uploading..." : "Upload"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}

export default UploadPdf
