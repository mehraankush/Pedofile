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
import { EllipsisVertical, FileText, Trash2 } from "lucide-react"
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
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <div className="font-medium truncate" title={pdf.title}>
                  {pdf.title}
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <EllipsisVertical />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={`/pdf/${pdf._id}`}>View PDF</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsShareDialogOpen(true)}>Share PDF</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <Link href={`/pdf/${pdf._id}`} className="block">
            <div className="aspect-[4/3] bg-muted flex items-center justify-center p-4">
              <iframe
                src={`${imageLink(pdf?.fileUrl || "")}#toolbar=0`}
                className="w-full h-full bg-white"
                title={`${pdf.title} Brochure`}
                frameBorder="0"
                allow="autoplay"
              ></iframe>
            </div>
          </Link>
        </CardContent>
        <CardFooter className="p-4 border-t flex items-center justify-between">
          <div className="text-sm text-muted-foreground">Uploaded on {pdf?.createdAt}</div>
          {/* <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MessageCircle className="h-4 w-4" />
            {pdf.commentCount} {pdf.commentCount === 1 ? "comment" : "comments"}
          </div> */}
        </CardFooter>
      </Card>

      <SharePdfDialog isOpen={isShareDialogOpen} onClose={() => setIsShareDialogOpen(false)} pdf={pdf} />
    </>
  )
}

export default PdfCard
