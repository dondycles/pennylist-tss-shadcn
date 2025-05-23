import { Database } from "@/lib/server/supabase/types";
import { useMoneyState } from "@/lib/stores/money-state";
import _ from "lodash";
import { useEffect } from "react";

export default function TotalMoneySetter({
  moneys,
}: {
  moneys: Database["public"]["Tables"]["money"]["Row"][];
}) {
  const { setTotal } = useMoneyState();
  useEffect(() => {
    setTotal(_.sum(moneys.map((m) => m.amount)));
  }, [moneys]);
  return null;
}
