import type React from "react"
import PdfCardSkeleton from "./pdf-card-skeleton"


interface PdfGridSkeletonProps {
    count?: number
}

const PdfGridSkeleton: React.FC<PdfGridSkeletonProps> = ({ count = 6 }) => {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array(count)
                .fill(0)
                .map((_, index) => (
                    <PdfCardSkeleton key={index} />
                ))}
        </div>
    )
}

export default PdfGridSkeleton
