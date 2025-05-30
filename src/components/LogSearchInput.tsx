import { useId } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "@tanstack/react-router";
import { Filter } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./animate-ui/radix/dialog";
import { Badge } from "./ui/badge";

export default function LogSearchInput({ moneyIds }: { moneyIds: React.ReactNode }) {
  const id = useId();
  return (
    <div className="*:not-first:mt-2">
      <Label htmlFor={id}>Input with end select</Label>
      <div className="flex rounded-md shadow-xs">
        <Input
          id={id}
          className="-me-px rounded-e-none shadow-none focus-visible:z-10"
          placeholder="Search for 'reason'"
          type="text"
        />
        <Dialog modal={false}>
          <DialogTrigger className="text-muted-foreground flex items-center gap-2 rounded-s-none rounded-e-full border pr-4 pl-3 text-sm">
            <Filter className="size-4" />
            <span>Filter</span>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Filter Logs</DialogTitle>
              <DialogDescription>
                Use the filters to narrow down your log search results. You can filter by
                type, money, and more.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-muted-foreground text-sm">Moneys:</p>
                {moneyIds}
              </div>
              <div className="space-y-2">
                <p className="text-muted-foreground text-sm">Type:</p>
                <div className="flex flex-wrap gap-2">
                  {["add", "edit", "delete", "transfer"].map((type) => (
                    <Badge
                      asChild
                      className="rounded-full text-sm"
                      variant={"secondary"}
                      key={type}
                    >
                      <Link
                        to="/logs"
                        search={{ type: type as "add" | "edit" | "delete" | "transfer" }}
                      >
                        {type}
                      </Link>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
