import React from 'react'
import { FileText, Share2, MessageSquare, Shield, ChevronRight } from 'lucide-react'
import Link from 'next/link'

const keyFeatures = [{
  icon: FileText,
  title: "Document Management",
  description: "Upload, organize, and manage all your PDF documents in one place",
  color: "bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-300",
},
{
  icon: Share2,
  title: "Easy Sharing",
  description: "Share PDFs with anyone using a unique link, no account required",
  color: "bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-300",
},
{
  icon: MessageSquare,
  title: "Collaborative Comments",
  description: "Add comments, provide feedback, and discuss directly on the document",
  color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300",
},
{
  icon: Shield,
  title: "Secure Access",
  description: "Control who can view and comment on your documents with secure sharing",
  color: "bg-sky-100 text-sky-600 dark:bg-sky-950 dark:text-sky-300",
},
]

const Features = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Powerful Features</h2>
          <p className="text-gray-500 dark:text-gray-400 md:text-lg max-w-[700px] mx-auto">
            Everything you need to manage and collaborate on PDF documents efficiently
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2">
          {keyFeatures.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col bg-white dark:bg-gray-800 items-center text-center space-y-4 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className={`p-3 rounded-full ${feature.color}`}>
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold">{feature.title}</h3>
              <p className="text-gray-500 dark:text-gray-400">{feature.description}</p>
              <Link href="#" className="inline-flex items-center text-primary font-medium text-sm mt-2">
                Learn more
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features