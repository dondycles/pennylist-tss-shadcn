import { useFloatingNavState } from "@/lib/stores/floating-nav-state";
import { Link, useRouterState } from "@tanstack/react-router";
import { Activity, FileClock, List, Plus, Settings } from "lucide-react";
import { MotionHighlight } from "./animate-ui/effects/motion-highlight";
import MoneyFormDialog from "./MoneyFormDialog";
import { Button } from "./ui/button";
export default function FloatingNav() {
  const floatingNavState = useFloatingNavState();
  const route = useRouterState();
  return (
    <nav className="bg-muted/25 fixed bottom-4 left-1/2 z-50 flex max-h-11 w-fit max-w-4xl -translate-x-1/2 items-center justify-center gap-1 rounded-full border p-1 drop-shadow-xl backdrop-blur-3xl">
      <MotionHighlight
        defaultValue={route.location.pathname}
        className="bg-foreground/10 rounded-full"
      >
        <div key="/list" data-value="/list">
          <MoneyFormDialog
            deepView={false}
            desc="It's always nice to have new money."
            title="Add Money"
          >
            <Button
              hidden={!floatingNavState.showAddMoneyBtn}
              type="button"
              size="icon"
              className="-ml-2 size-12"
            >
              <Plus className="size-5" />
            </Button>
          </MoneyFormDialog>
          <Button
            asChild
            hidden={floatingNavState.showAddMoneyBtn}
            type="button"
            size={"icon"}
            variant={"ghost"}
            className="hover:bg-transparent"
          >
            <Link to="/list">
              <List className="size-5" />
            </Link>
          </Button>
        </div>

        <div key="/logs" data-value="/logs">
          <Button
            className="hover:bg-transparent"
            asChild
            type="button"
            size={"icon"}
            variant={"ghost"}
          >
            <Link to="/logs" search={{ flow: "desc" }}>
              <FileClock className="size-5" />
            </Link>
          </Button>
        </div>
        <div key="/analytics" data-value="/analytics">
          <Button
            className="hover:bg-transparent"
            asChild
            type="button"
            size={"icon"}
            variant={"ghost"}
          >
            <Link to="/analytics">
              <Activity className="size-5" />
            </Link>
          </Button>
        </div>
        <div key="/settings" data-value="/settings">
          <Button
            className="hover:bg-transparent"
            asChild
            size={"icon"}
            variant={"ghost"}
          >
            <Link to="/settings">
              <Settings className="size-5" />
            </Link>
          </Button>
        </div>
      </MotionHighlight>
    </nav>
  );
}
