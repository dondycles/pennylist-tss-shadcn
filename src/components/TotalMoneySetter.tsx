import { Money } from "@/lib/server/fn/money";
import { useMoneyState } from "@/lib/stores/money-state";
import _ from "lodash";
import { useEffect } from "react";

export default function TotalMoneySetter({ money }: { money: Money[] }) {
  const { setTotal } = useMoneyState();
  useEffect(() => {
    setTotal(_.sum(money.map((m) => m.amount)));
  }, [money]);
  return null;
}
