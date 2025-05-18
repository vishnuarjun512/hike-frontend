import { Skeleton } from "./ui/skeleton";

export const SkeletonComponent = ({ times = 3 }: { times: number }) => {
  return (
    <>
      {Array.from({ length: times }).map((_, index) => (
        <div key={index} className="flex items-center space-x-4 mt-2">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      ))}
    </>
  );
};
