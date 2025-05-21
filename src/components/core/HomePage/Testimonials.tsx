import React from 'react'


const testimonials = [
    {
        quote: "This platform has transformed how our team collaborates on documents. The commenting feature is a game-changer!",
        author: "Sarah Johnson",
        role: "Project Manager",
        company: "Acme Inc.",
    },
    {
        quote: "We've reduced our document review time by 40% since switching to this platform. Highly recommended!",
        author: "Michael Chen",
        role: "Design Lead",
        company: "Creative Studios",
    },
    {
        quote: "The security features give us peace of mind when sharing sensitive documents with clients and partners.",
        author: "Alex Rodriguez",
        role: "Legal Counsel",
        company: "LegalEdge",
    },
  ]
  
const Testimonials = () => {
  return (
        <section className="py-16 bg-gray-50 dark:bg-gray-900">
            <div className="container px-4 md:px-6">
                <div className="text-center space-y-4 mb-12">
                    <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">What Our Users Say</h2>
                    <p className="text-gray-500 dark:text-gray-400 md:text-lg max-w-[700px] mx-auto">
                        Trusted by professionals and teams around the world
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-3">
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={index}
                            className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200"
                        >
                            <div className="flex flex-col h-full">
                                <div className="mb-4">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <svg key={star} className="w-5 h-5 text-yellow-400 inline-block" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                        </svg>
                                    ))}
                                </div>
                                <blockquote className="flex-1">
                                    <p className="text-gray-700 dark:text-gray-300 mb-4">{`${testimonial.quote}`}</p>
                                </blockquote>
                                <footer className="mt-auto">
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-3">
                                            <span className="text-gray-600 dark:text-gray-300 font-medium">
                                                {testimonial.author.split(' ').map(name => name[0]).join('')}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="font-medium">{testimonial.author}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}, {testimonial.company}</p>
                                        </div>
                                    </div>
                                </footer>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Testimonials