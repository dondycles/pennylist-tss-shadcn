import { PageState, usePageState } from "@/lib/stores/page-state";
import { useEffect } from "react";

export default function PageStatusSetter({
  state,
}: {
  state: Omit<PageState, "setState">;
}) {
  const pageState = usePageState();

  useEffect(() => {
    pageState.setState(state);
  }, []);
  return null;
}
