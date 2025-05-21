import { useId } from "react";

import { Label } from "@/components/ui/label";
import { ArrowDown, ArrowUp, Calendar, ChevronDownIcon, DollarSign } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/animate-ui/radix/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useListState } from "@/lib/stores/list-state";
export default function ListSorterDropdown() {
  const id = useId();
  const { flow, setState, sortBy } = useListState();
  return (
    <div className="bg-muted flex items-center justify-between gap-4 rounded-3xl p-4">
      <Label htmlFor={id}>List Sorting</Label>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            {flow === "asc" ? <ArrowUp /> : <ArrowDown />}
            {sortBy === "amount" ? <DollarSign /> : null}
            {sortBy === "date" ? <Calendar /> : null}
            <span className="capitalize">{sortBy}</span>
            <ChevronDownIcon className="-me-1 opacity-60" size={16} aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuRadioGroup
            value={sortBy}
            onValueChange={(v) => setState({ flow, sortBy: v as "date" | "amount" })}
          >
            <DropdownMenuRadioItem value="date">Date</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="amount">Amount</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup
            value={flow}
            onValueChange={(v) => setState({ flow: v as "desc" | "asc", sortBy })}
          >
            <DropdownMenuRadioItem value="asc">Ascending</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="desc">Descending</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
