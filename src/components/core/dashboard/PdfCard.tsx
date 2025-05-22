"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { EllipsisVertical, Eye, FileText, Share2 } from 'lucide-react'
import { SharePdfDialog } from "@/components/common/ShareModal"
import { PdfDocumentType } from "@/types/global"

interface PdfCardProps {
  pdf: PdfDocumentType
}

const PdfCard: React.FC<PdfCardProps> = ({ pdf }) => {
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false)


  const imageLink = (url: string) => {
    if (!url) return "https://imgcdn.stablediffusionweb.com/2024/3/21/8a243bb8-1b07-4613-a0ef-eec171a1a112.jpg"
    if (url.includes("drive.google.com/file/d/")) {
      const fileId = url.split("/file/d/")[1].split("/")[0]
      return `https://drive.google.com/file/d/${fileId}/preview`
    }
    return url
  }


  return (
    <>
      <Card className="overflow-hidden transition-all duration-200 hover:shadow-md pt-2 pb-2">
        <CardContent className="p-0">
          <div className="px-2 pb-1 border-b flex items-center justify-between">
            <Link href={`/pdf/${pdf._id}`} className="underline">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-rose-500" />
                <div className="font-medium truncate max-w-[180px]" title={pdf.title}>
                  {pdf.title}
                </div>
              </div>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <EllipsisVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/pdf/${pdf._id}`}>View PDF</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsShareDialogOpen(true)}>Share PDF</DropdownMenuItem>
                <DropdownMenuSeparator />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Link href={`/pdf/${pdf._id}`} className="block">
            <div className="aspect-[4/3] bg-slate-50 relative group">
              <div className="absolute inset-0 flex items-center justify-center">
                <iframe
                  src={`${imageLink(pdf?.fileUrl || "")}#toolbar=0`}
                  className="w-full h-full bg-white"
                  title={`${pdf.title} Brochure`}
                  frameBorder="0"
                  allow="autoplay"
                ></iframe>

                {/* PDF icon overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <FileText className="h-16 w-16 text-rose-500/20" />
                </div>

                {/* Hover overlay with view button */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button variant="secondary" size="sm" className="gap-2">
                    <Eye className="h-4 w-4" />
                    View PDF
                  </Button>
                </div>
              </div>
            </div>
          </Link>
        </CardContent>

        <CardFooter className="p-3 pb-0 pt-0 flex justify-between items-center text-sm text-muted-foreground">
          <span>
            {new Date(pdf.createdAt || Date.now()).toLocaleString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
          </span>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsShareDialogOpen(true)}
            className="h-8 gap-1 cursor-pointer"
          >
            <Share2 className="h-3.5 w-3.5" />
            Share
          </Button>
        </CardFooter>

      </Card>

      <SharePdfDialog isOpen={isShareDialogOpen} onClose={() => setIsShareDialogOpen(false)} pdf={pdf} />
    </>
  )
}

export default PdfCard
