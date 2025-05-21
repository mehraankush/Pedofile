"use client"

import type React from "react"

import { useMemo, useState } from "react"
import { FileText } from "lucide-react"

import { useGetUserPdfs } from "@/services/pdf"
import { PdfDocumentType } from "@/types/global"
import PdfCard from "@/components/core/dashboard/PdfCard"
import UploadPdf from "@/components/core/dashboard/UploadPdf"
import PdfGridSkeleton from "@/components/core/dashboard/pdf-grid-skeleton"



export default function DashboardPage() {

    const [searchQuery, setSearchQuery] = useState("")
    const { data: alluserPdfs, isLoading } = useGetUserPdfs();

    const filteredPdfs = useMemo(() => {
        console.log("wjkefbre")
        return alluserPdfs && alluserPdfs.filter((pdf: PdfDocumentType) =>
            pdf.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
    }, [searchQuery])


    console.log('alluserPdfs', alluserPdfs)
    return (
        <div className="flex min-h-screen flex-col">

            <main className="flex-1">
                <div className="container">

                    <UploadPdf
                        setSearchQuery={setSearchQuery}
                        searchQuery={searchQuery}
                    />

                    { isLoading && <PdfGridSkeleton /> }


                    {filteredPdfs && filteredPdfs.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="flex justify-center mb-4">
                                <FileText className="h-12 w-12 text-muted-foreground/60" />
                            </div>
                            <h3 className="text-lg font-medium mb-2">No PDFs found</h3>
                            <p className="text-muted-foreground mb-4">
                                {searchQuery ? "No PDFs match your search query" : "Upload your first PDF to get started"}
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {alluserPdfs?.length > 0 &&
                                alluserPdfs.map((pdf: PdfDocumentType, ind: number) => (
                                    <PdfCard
                                        key={ind}
                                        pdf={pdf}
                                    />
                                ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
