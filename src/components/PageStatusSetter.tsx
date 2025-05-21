import { FloatingNavState, useFloatingNavState } from "@/lib/stores/floating-nav-state";
import { useEffect, useState } from "react";

export default function PageStatusSetter({
  state,
}: {
  state: Omit<FloatingNavState, "setState">;
}) {
  const [mounted, setMounted] = useState(false);
  const floatingNavState = useFloatingNavState();

  useEffect(() => {
    if (mounted) floatingNavState.setState(state);
  }, [mounted]);

  useEffect(() => {
    setMounted(true);
  }, []);
  return null;
}
