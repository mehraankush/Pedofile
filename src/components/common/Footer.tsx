import React from 'react'
import { FileText } from 'lucide-react'

const Footer = () => {
  return (
      <footer className="border-t py-6">
          <div className="container flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  <p className="text-sm font-medium">PDFCollab</p>
              </div>
              <p className="text-sm text-muted-foreground">© 2025 PDFCollab. All rights reserved.</p>
          </div>
      </footer>
  )
}

export default Footer