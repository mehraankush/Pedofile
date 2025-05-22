"use client"

import { useEffect, useRef, useState } from "react"
import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog"
import { X } from "lucide-react"

interface VideoModalProps {
    isOpen: boolean
    onClose: () => void
    videoId: string
}


export default function WatchNow() {
    const [isModalOpen, setIsModalOpen] = useState(false)

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className=" cursor-pointer gap-2 text-base font-medium px-6 py-3 rounded-xl border-2 inline-flex items-center"
            >
                Watch Demo
                <svg
                    width="15"
                    height="15"
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                >
                    <path
                        d="M3.24182 2.32181C3.3919 2.23132 3.5784 2.22601 3.73338 2.30781L12.7334 7.05781C12.8974 7.14436 13 7.31457 13 7.5C13 7.68543 12.8974 7.85564 12.7334 7.94219L3.73338 12.6922C3.5784 12.774 3.3919 12.7687 3.24182 12.6782C3.09175 12.5877 3 12.4252 3 12.25V2.75C3 2.57476 3.09175 2.4123 3.24182 2.32181ZM4 3.57925V11.4207L11.4288 7.5L4 3.57925Z"
                        fill="currentColor"
                        fillRule="evenodd"
                        clipRule="evenodd"
                    ></path>
                </svg>
            </button>

            <VideoModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                videoId="-p1mQ31MlXI" // Replace with your actual YouTube video ID
            />
        </>

    )
}


export function VideoModal({ isOpen, onClose, videoId }: VideoModalProps) {
    const iframeRef = useRef<HTMLIFrameElement>(null)

    // Stop video playback when modal closes
    useEffect(() => {
        if (!isOpen && iframeRef.current) {
            // This resets the iframe src which stops the video
            const currentSrc = iframeRef.current.src
            iframeRef.current.src = ""
            setTimeout(() => {
                if (iframeRef.current) {
                    iframeRef.current.src = currentSrc
                }
            }, 50)
        }
    }, [isOpen])

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogOverlay className="bg-black/80" />
            <DialogContent className="sm:max-w-[800px] p-0 bg-transparent border-none shadow-none">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 z-10 rounded-full bg-black/50 p-1 text-white hover:bg-black/70"
                    aria-label="Close"
                >
                    <X className="h-5 w-5" />
                </button>
                <div className="aspect-video w-full overflow-hidden rounded-lg">
                    <iframe
                        ref={iframeRef}
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="aspect-video"
                    ></iframe>
                </div>
            </DialogContent>
        </Dialog>
    )
}
