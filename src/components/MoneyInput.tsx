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
      <DollarSign className="text-muted-foreground absolute top-1/2 left-px box-content size-4 -translate-y-1/2 rounded-full p-2 backdrop-blur-2xl" />
    </div>
  );
}
