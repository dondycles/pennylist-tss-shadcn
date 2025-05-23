import { Database } from "@/lib/server/supabase/types";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./animate-ui/radix/dialog";
import MoneyForm from "./form/MoneyForm";
export default function MoneyFormDialog({
  title,
  desc,
  children,
  initialData,
  deepView,
}: {
  title: string;
  desc: string;
  children: React.ReactNode;
  initialData?: Database["public"]["Tables"]["money"]["Row"];
  deepView: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{desc}</DialogDescription>
        </DialogHeader>
        <MoneyForm
          initialData={initialData}
          close={() => {
            setOpen(false);
          }}
          deepView={deepView}
        />
      </DialogContent>
    </Dialog>
  );
}
