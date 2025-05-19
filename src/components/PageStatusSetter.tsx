import { usePageState } from "@/lib/stores/page-state";
import { useEffect } from "react";

export default function PageStatusSetter({
  showAddMoneyBtn,
}: {
  showAddMoneyBtn: boolean;
}) {
  const pageState = usePageState();

  useEffect(() => {
    pageState.setShowAddMoneyBtn(showAddMoneyBtn);
  }, []);
  return null;
}
