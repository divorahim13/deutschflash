import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function DashboardSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl animate-pulse">
      <div className="flex justify-between items-center mb-10">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32 w-full rounded-2xl" />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-8">
          <Skeleton className="h-[350px] w-full rounded-2xl" />
          <Skeleton className="h-40 w-full rounded-2xl" />
        </div>
        <div className="space-y-8">
          <Skeleton className="h-[400px] w-full rounded-2xl" />
        </div>
      </div>
    </div>
  )
}

export function ReviewSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[80vh] gap-8">
      <Skeleton className="h-4 w-64" />
      <Card className="w-full max-w-2xl h-[400px] flex flex-col items-center justify-center p-8">
         <Skeleton className="h-12 w-48 mb-6" />
         <Skeleton className="h-20 w-full mb-8" />
         <Skeleton className="h-12 w-full max-w-sm rounded-xl" />
      </Card>
      <div className="flex gap-4 w-full max-w-2xl">
         {[1, 2, 3, 4].map((i) => (
           <Skeleton key={i} className="h-12 flex-1 rounded-xl" />
         ))}
      </div>
    </div>
  )
}
