import { useMoneyState } from "@/lib/stores/money-state";
import { usePageState } from "@/lib/stores/page-state";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, Eye, EyeOff, Plus } from "lucide-react";
import { motion } from "motion/react";
import MoneyFormDialog from "./MoneyFormDialog";
import ThemeToggle from "./ThemeToggle";
import { Button } from "./ui/button";
export default function FloatingNav() {
  const pageState = usePageState();
  const moneyState = useMoneyState();
  return (
    <nav className="bg-muted fixed bottom-4 left-1/2 z-50 flex max-h-9 w-fit max-w-4xl -translate-x-1/2 items-center justify-center gap-1 rounded-full drop-shadow-xl">
      <Button
        onClick={() => moneyState.setAsterisk(!moneyState.asterisk)}
        type="button"
        size={"icon"}
        variant={"ghost"}
      >
        {!moneyState.asterisk ? (
          <Motion key="eyeoff">
            <EyeOff />
          </Motion>
        ) : (
          <Motion key="eyeon">
            <Eye />
          </Motion>
        )}
      </Button>
      {pageState.showAddMoneyBtn ? (
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
        <Link to="/list">
          <Button type="button" size="icon" className="mb-2 size-12">
            <Motion key="back">
              <ChevronLeft className="size-5" />
            </Motion>
          </Button>
        </Link>
      )}

      <ThemeToggle />
    </nav>
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
