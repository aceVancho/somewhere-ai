import { Skeleton } from "@/components/ui/skeleton"

export const SkeletonContainer: React.FC =() => {
    return (
      <div className="flex items-center space-y-3 space-x-4">
        <Skeleton className="h-10 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-3 w-[250px]" />
          <Skeleton className="h-3 w-[200px]" />
        </div>
      </div>
    )
  }