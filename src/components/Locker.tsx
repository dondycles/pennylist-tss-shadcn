import { OTPInput } from "input-otp";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./animate-ui/radix/dialog";
import Slot from "./Slot";

export default function Locker({ PIN }: { PIN?: string | null }) {
  const [unLocked, setUnlocked] = useState(false);

  return (
    <Dialog open={!unLocked && Boolean(PIN)} onOpenChange={setUnlocked}>
      <DialogContent
        overlayClassName="bg-transparent backdrop-blur fixed inset-0 z-50"
        showX={false}
        onInteractOutside={(e) => e.preventDefault()}
        className=""
      >
        <DialogHeader>
          <DialogTitle>Enter PIN : {PIN}</DialogTitle>
        </DialogHeader>
        <OTPInput
          onChange={async (value) => {
            if (value.length === 4) {
              setUnlocked(PIN === value);
            }
          }}
          containerClassName="flex items-center gap-3 has-disabled:opacity-50 mx-auto"
          maxLength={4}
          render={({ slots }) => (
            <div className="flex">
              {slots.map((slot, idx) => (
                <Slot key={idx} {...slot} />
              ))}
            </div>
          )}
        />
      </DialogContent>
    </Dialog>
  );
}
