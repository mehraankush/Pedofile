import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  FileText,
  Share2,
  MessageSquare,
  Shield
} from "lucide-react"
import Footer from "@/components/common/Footer"
import Navbar from "@/components/common/Navbar"


export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">

      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto">

        <section className="py-20">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Manage & Collaborate on PDF Documents
                </h1>
                <p className="text-muted-foreground md:text-xl">
                  Upload, share, and collaborate on PDF documents with your team. Add comments, get feedback, and work
                  together seamlessly.
                </p>

                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/signup">
                    <Button size="lg" className="gap-1.5 cursor-pointer">
                      Get Started <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button size="lg" variant="outline" className="cursor-pointer">
                      Login to Your Account
                    </Button>
                  </Link>
                </div>

              </div>
              <div className="flex justify-center">
                <div className="relative w-full max-w-md">
                  <div className="relative bg-white shadow-lg rounded-lg overflow-hidden border">
                    <div className="p-4 border-b">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        <div className="font-medium">Project Proposal.pdf</div>
                      </div>
                    </div>
                    <div className="aspect-[4/3] bg-muted flex items-center justify-center p-4">
                      <div className="text-center space-y-2">
                        <FileText className="h-16 w-16 mx-auto text-muted-foreground/60" />
                        <div className="text-sm text-muted-foreground">PDF Preview</div>
                      </div>
                    </div>
                    <div className="p-4 border-t">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">5 comments</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Share2 className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Shared with 3 people</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16 lg:py-20">
          <div className="container px-4 md:px-6">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl font-bold tracking-tighter">Key Features</h2>
              <p className="text-muted-foreground md:text-lg max-w-[700px] mx-auto">
                Everything you need to manage and collaborate on PDF documents
              </p>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center text-center space-y-2 p-4 rounded-lg border bg-card">
                <div className="p-2 rounded-full bg-primary/10">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium">PDF Management</h3>
                <p className="text-muted-foreground">
                  Upload, organize, and manage all your PDF documents in one place
                </p>
              </div>
              <div className="flex flex-col items-center text-center space-y-2 p-4 rounded-lg border bg-card">
                <div className="p-2 rounded-full bg-primary/10">
                  <Share2 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium">Easy Sharing</h3>
                <p className="text-muted-foreground">Share PDFs with anyone using a unique link, no account required</p>
              </div>
              <div className="flex flex-col items-center text-center space-y-2 p-4 rounded-lg border bg-card">
                <div className="p-2 rounded-full bg-primary/10">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium">Collaborative Comments</h3>
                <p className="text-muted-foreground">
                  Add comments, provide feedback, and discuss directly on the document
                </p>
              </div>
              <div className="flex flex-col items-center text-center space-y-2 p-4 rounded-lg border bg-card">
                <div className="p-2 rounded-full bg-primary/10">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium">Secure Access</h3>
                <p className="text-muted-foreground">
                  Control who can view and comment on your documents with secure sharing
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
