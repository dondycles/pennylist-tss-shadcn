import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./animate-ui/radix/dialog";
import { Button } from "./ui/button";

export default function ActionConfirmDialog({
  children,
  title,
  desc,
  confirm,
}: {
  children: React.ReactNode;
  title: string;
  desc: string;
  confirm: () => void;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{desc}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex w-full flex-row">
          <DialogClose className="flex-1">
            <Button className="w-full" variant={"destructive"}>
              Cancel
            </Button>
          </DialogClose>
          <DialogClose className="flex-1">
            <Button variant={"ghost"} className="w-full" onClick={() => confirm()}>
              Confirm
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
