import { Skeleton } from "./ui/skeleton";

export default function MoneySkeleton() {
  return (
    <div className="w-full rounded-none border-b p-4">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="mt-2 h-4 w-24" />
      <div className="mt-8 flex gap-4">
        <Skeleton className="size-6" />
        <Skeleton className="size-6" />
        <Skeleton className="size-6" />
        <Skeleton className="size-6" />
      </div>
    </div>
  );
}
