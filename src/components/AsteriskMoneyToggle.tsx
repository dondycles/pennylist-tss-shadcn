import { Eye, EyeClosed } from "lucide-react";
import { useId } from "react";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useMoneyState } from "@/lib/stores/money-state";

export default function AsteriskMoneyToggle() {
  const id = useId();
  const { asterisk, setAsterisk } = useMoneyState();

  return (
    <div className="bg-muted flex items-center justify-between gap-4 rounded-3xl p-4">
      <Label htmlFor={id}>Money Visibility</Label>
      <div
        id={id}
        className="relative inline-grid h-9 grid-cols-[1fr_1fr] items-center text-sm font-medium"
      >
        <Switch
          checked={asterisk}
          onCheckedChange={setAsterisk}
          className="peer data-[state=unchecked]:bg-input/50 absolute inset-0 h-[inherit] w-auto cursor-pointer [&_span]:z-10 [&_span]:h-full [&_span]:w-1/2 [&_span]:transition-transform [&_span]:duration-300 [&_span]:ease-[cubic-bezier(0.16,1,0.3,1)] [&_span]:data-[state=checked]:translate-x-full [&_span]:data-[state=checked]:rtl:-translate-x-full"
        />
        <span className="pointer-events-none relative ms-0.5 flex min-w-8 items-center justify-center text-center transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] peer-data-[state=checked]:invisible peer-data-[state=unchecked]:translate-x-full peer-data-[state=unchecked]:rtl:-translate-x-full">
          <Eye size={16} aria-hidden="true" />
        </span>
        <span className="peer-data-[state=checked]:text-background pointer-events-none relative me-0.5 flex min-w-8 items-center justify-center text-center transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] peer-data-[state=checked]:-translate-x-full peer-data-[state=unchecked]:invisible peer-data-[state=checked]:rtl:translate-x-full">
          <EyeClosed size={16} aria-hidden="true" />
        </span>
      </div>
    </div>
  );
}
