import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const PdfCardSkeleton = () => {
    return (
        <Card className="overflow-hidden">
            <CardContent className="p-0">
                <div className="p-4 border-b">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-5 w-5 rounded" />
                            <Skeleton className="h-5 w-40" />
                        </div>
                        <Skeleton className="h-8 w-8 rounded-full" />
                    </div>
                </div>
                <div className="aspect-[4/3] bg-muted p-4">
                    <Skeleton className="w-full h-full" />
                </div>
            </CardContent>
            <CardFooter className="p-4 border-t flex items-center justify-between">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
            </CardFooter>
        </Card>
    )
}

export default PdfCardSkeleton
