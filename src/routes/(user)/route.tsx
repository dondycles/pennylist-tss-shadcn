import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/animate-ui/radix/dialog";
import FloatingNav from "@/components/FloatingNav";
import Slot from "@/components/Slot";
import { userPINQueryOptions } from "@/lib/queries/user";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { OTPInput } from "input-otp";
import { useState } from "react";

export const Route = createFileRoute("/(user)")({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    const REDIRECT_URL = "/login";
    if (!context.user) {
      throw redirect({
        to: REDIRECT_URL,
      });
    }
    return {
      redirectUrl: REDIRECT_URL,
    };
  },
});

function RouteComponent() {
  const { user } = Route.useRouteContext();
  const { data: PIN, isFetched } = useQuery(userPINQueryOptions());
  const [unLocked, setUnlocked] = useState(isFetched && !PIN);

  if (user)
    return (
      <div className="flex h-full w-full justify-center overflow-hidden">
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
        {unLocked ? <Outlet /> : null}
        <FloatingNav />
      </div>
    );
}
