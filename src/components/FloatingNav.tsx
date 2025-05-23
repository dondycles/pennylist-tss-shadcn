import { useFloatingNavState } from "@/lib/stores/floating-nav-state";
import { Link } from "@tanstack/react-router";
import { Activity, FileClock, List, Plus, Settings } from "lucide-react";
import MoneyFormDialog from "./MoneyFormDialog";
import { Button } from "./ui/button";
export default function FloatingNav() {
  const floatingNavState = useFloatingNavState();
  return (
    <nav className="bg-muted/25 fixed bottom-4 left-1/2 z-50 flex max-h-11 w-fit max-w-4xl -translate-x-1/2 items-center justify-center gap-1 rounded-full border p-1 drop-shadow-xl backdrop-blur-3xl">
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
      <Button type="button" size={"icon"} variant={"ghost"}>
        <Link to="/list">
          <List
            className={`${floatingNavState.showAddMoneyBtn ? "text-foreground" : "text-muted-foreground"} size-5`}
          />
        </Link>
      </Button>
      <Button asChild type="button" size={"icon"} variant={"ghost"}>
        <Link to="/logs" search={{ flow: "desc" }}>
          <FileClock
            className={`${!floatingNavState.showLogsPageBtn ? "text-foreground" : "text-muted-foreground"} size-5`}
          />
        </Link>
      </Button>
      <Button asChild type="button" size={"icon"} variant={"ghost"}>
        <Link to="/analytics">
          <Activity
            className={`${!floatingNavState.showAnalyticsPageBtn ? "text-foreground" : "text-muted-foreground"} size-5`}
          />
        </Link>
      </Button>
      <Button asChild size={"icon"} variant={"ghost"}>
        <Link to="/settings">
          <Settings
            className={`${!floatingNavState.showSettingsBtn ? "text-foreground" : "text-muted-foreground"} size-5`}
          />
        </Link>
      </Button>
    </nav>
  );
}

// function Motion({ children, key }: { children: React.ReactNode; key: string }) {
//   return (
//     <motion.div
//       key={key}
//       initial={{ rotate: "-90deg", scale: 0.5 }}
//       animate={{ rotate: "0deg", scale: 1 }}
//     >
//       {children}
//     </motion.div>
//   );
// }
