import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, FileText, Share2, MessageSquare, CheckCircle } from 'lucide-react'
import Footer from "@/components/common/Footer"
import Navbar from "@/components/common/Navbar"
import Testimonials from "@/components/core/HomePage/Testimonials"
import Features from "@/components/core/HomePage/Features"
import WatchNow  from "@/components/core/HomePage/Video-component"



export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-grid-gray-100/50 dark:bg-grid-gray-950/40 bg-[size:30px_30px] [mask-image:radial-gradient(ellipse_at_center,white,transparent_75%)]"></div>

          <div className="container px-4 md:px-6 relative">
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-6 max-w-xl">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-2">
                  <span className="flex items-center">
                    <CheckCircle className="mr-1 h-3.5 w-3.5" />
                    Trusted by 10,000+ teams
                  </span>
                </div>

                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400">
                  Manage & Collaborate on PDF Documents
                </h1>

                <p className="text-gray-600 dark:text-gray-300 text-xl leading-relaxed">
                  Upload, share, and collaborate on PDF documents with your team. Add comments, get feedback, and work
                  together seamlessly in real-time.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Link href="/dashboard">
                    <Button size="lg" className="gap-2 w-full sm:w-fit text-base font-medium px-6 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 bg-primary hover:bg-primary/90 cursor-pointer">
                      Get Started Free
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </Link>
                  {/* <Button variant="outline" size="lg" className="gap-2 text-base font-medium px-6 py-6 rounded-xl border-2">
                    Watch Demo
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
                      <path d="M3.24182 2.32181C3.3919 2.23132 3.5784 2.22601 3.73338 2.30781L12.7334 7.05781C12.8974 7.14436 13 7.31457 13 7.5C13 7.68543 12.8974 7.85564 12.7334 7.94219L3.73338 12.6922C3.5784 12.774 3.3919 12.7687 3.24182 12.6782C3.09175 12.5877 3 12.4252 3 12.25V2.75C3 2.57476 3.09175 2.4123 3.24182 2.32181ZM4 3.57925V11.4207L11.4288 7.5L4 3.57925Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                    </svg>
                  </Button> */}
                  <WatchNow/>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 overflow-hidden bg-gray-200 dark:bg-gray-700">
                        <Image
                          src={`/ankush.png`}
                          alt={`User ${i}`}
                          width={32}
                          height={32}
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Join <span className="font-medium text-gray-900 dark:text-gray-200">2,500+</span> users this month
                  </span>
                </div>
              </div>

              <div className="relative flex justify-center lg:justify-end">
                <div className="relative w-full max-w-md transform transition-all duration-500 hover:scale-[1.02] hover:rotate-1">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/20 to-primary/10 blur-xl"></div>
                  <Link href="https://www.linkedin.com/in/ankush-mehra-9a57a1233/" target="_blank">
                    <div className="relative bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
                      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-primary" />
                          <div className="font-medium">Project Proposal.pdf</div>
                          <div className="ml-auto flex gap-1">
                            <span className="inline-flex items-center rounded-full bg-green-100 dark:bg-green-900/30 px-2 py-0.5 text-xs font-medium text-green-700 dark:text-green-300">
                              Shared
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="aspect-[4/3] bg-gray-100 dark:bg-gray-800 flex items-center justify-center p-4 relative">
                        <div className="absolute inset-0 bg-grid-gray-200/50 dark:bg-grid-gray-900/30 bg-[size:20px_20px]"></div>
                        <Image
                          src="/ankush.png"
                          alt="PDF Preview"
                          className="w-full h-full bg-white dark:bg-gray-700 object-cover rounded-lg shadow-md relative z-10"
                          width={400}
                          height={300}
                        />

                        {/* Comment Annotation */}
                        <div className="absolute top-10 right-12 z-20 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-w-[180px] transform translate-x-1/2 animate-pulse">
                          <div className="flex items-start gap-2">
                            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                              <span className="text-xs font-bold text-primary">TJ</span>
                            </div>
                            <div>
                              <p className="text-xs font-medium">Ankush Mehra</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">Go toward innovation go Pedofile</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <MessageSquare className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                            <span className="text-sm text-gray-600 dark:text-gray-300">5 comments</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Share2 className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                            <span className="text-sm text-gray-600 dark:text-gray-300">Shared with 3 people</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Brands Section */}
        <section className="py-8 border-y border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center gap-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">TRUSTED BY INNOVATIVE COMPANIES</p>
              <div className="flex flex-wrap justify-center gap-x-12 gap-y-6 opacity-70">
                {['Microsoft', 'Google', 'Slack', 'Shopify', 'Adobe'].map((brand) => (
                  <div key={brand} className="text-xl font-semibold text-gray-400 dark:text-gray-600">
                    {brand}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <Features />

        <Testimonials />

        {/* CTA Section */}
        <section className="py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="relative overflow-hidden rounded-2xl bg-primary">
              <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px]"></div>
              <div className="relative p-8 md:p-12 lg:p-16 text-center md:text-left flex flex-col md:flex-row items-center gap-8 md:gap-12">
                <div className="flex-1 space-y-4">
                  <h2 className="text-3xl md:text-4xl font-bold text-white">Ready to streamline your document workflow?</h2>
                  <p className="text-primary-foreground/80 text-lg max-w-2xl">
                    Join thousands of teams who are already using our platform to collaborate on documents more efficiently.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 pt-2 justify-center md:justify-start">
                    <Link href="/dashboard">
                      <Button size="lg" variant="secondary" className="gap-2 text-base font-medium px-6 py-6 rounded-xl cursor-pointer w-full sm:w-fit">
                        Get Started Free
                        <ArrowRight className="h-5 w-5" />
                      </Button>
                    </Link>
                    <Button variant="outline" size="lg" className="gap-2 text-base font-medium px-6 py-6 rounded-xl border-2 bg-transparent text-white border-white/20 hover:bg-white/10">
                      Schedule a Demo
                    </Button>
                  </div>
                </div>
                <div className="hidden lg:block">
                  <div className="relative w-[300px] h-[200px] bg-white/10 rounded-lg p-1">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <FileText className="h-16 w-16 text-white/40" />
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 h-8 bg-white/10 rounded flex items-center px-3">
                      <div className="w-4 h-4 rounded-full bg-white/20 mr-2"></div>
                      <div className="h-2 w-24 bg-white/20 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
