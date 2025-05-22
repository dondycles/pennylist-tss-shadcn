import { useFloatingNavState } from "@/lib/stores/floating-nav-state";
import { Link } from "@tanstack/react-router";
import { Activity, ChartGantt, ChevronLeft, Plus, Settings } from "lucide-react";
import { motion } from "motion/react";
import MoneyFormDialog from "./MoneyFormDialog";
import { Button } from "./ui/button";
export default function FloatingNav() {
  const floatingNavState = useFloatingNavState();
  return (
    <motion.nav
      layout
      className="bg-muted fixed bottom-4 left-1/2 z-50 flex max-h-9 w-fit max-w-4xl -translate-x-1/2 items-center justify-center gap-1 rounded-full drop-shadow-xl"
    >
      {floatingNavState.showAddMoneyBtn ? (
        <MoneyFormDialog
          deepView={false}
          desc="It's always nice to have new money."
          title="Add Money"
        >
          <Button type="button" size="icon" className="mb-2 size-12">
            <Motion key="plus">
              <Plus className="size-5" />
            </Motion>
          </Button>
        </MoneyFormDialog>
      ) : (
        <Button asChild type="button" size="icon" className="mb-2 size-12">
          <Link to="/list">
            <Motion key="back">
              <ChevronLeft className="size-5" />
            </Motion>
          </Link>
        </Button>
      )}
      <Button
        hidden={!floatingNavState.showLogsPageBtn}
        asChild
        type="button"
        size={"icon"}
        variant={"ghost"}
      >
        <Link to="/logs">
          <ChartGantt className="size-5" />
        </Link>
      </Button>
      <Button
        hidden={!floatingNavState.showAnalyticsPageBtn}
        asChild
        type="button"
        size={"icon"}
        variant={"ghost"}
      >
        <Link to="/analytics">
          <Activity className="size-5" />
        </Link>
      </Button>
      <Button
        hidden={!floatingNavState.showSettingsBtn}
        asChild
        size={"icon"}
        variant={"ghost"}
      >
        <Link to="/settings">
          <Settings className="size-5" />
        </Link>
      </Button>
    </motion.nav>
  );
}

function Motion({ children, key }: { children: React.ReactNode; key: string }) {
  return (
    <motion.div
      key={key}
      initial={{ rotate: "-90deg", scale: 0.5 }}
      animate={{ rotate: "0deg", scale: 1 }}
    >
      {children}
    </motion.div>
  );
}
