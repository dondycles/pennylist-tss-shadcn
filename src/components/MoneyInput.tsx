import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function MoneyInput({
  className,
  type,
  ...props
}: React.ComponentProps<"input">) {
  return (
    <div className={cn("relative", className)}>
      <Input className="peer ps-6 pe-12" placeholder="0.00" type={type} {...props} />
      <span className="text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-sm peer-disabled:opacity-50">
        ₱
      </span>
      <span className="text-muted-foreground pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-sm peer-disabled:opacity-50">
        PHP
      </span>
    </div>
  );
}
