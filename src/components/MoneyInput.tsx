import { cn } from "@/lib/utils";
import { DollarSign } from "lucide-react";
import { Input } from "./ui/input";

export default function MoneyInput({
  className,
  type,
  ...props
}: React.ComponentProps<"input">) {
  return (
    <div className={cn("relative h-fit w-fit", className)}>
      <Input className="indent-5" type={type} {...props} />
      <DollarSign className="text-muted-foreground bg-background absolute top-1/2 left-3 size-4 -translate-y-1/2" />
    </div>
  );
}
