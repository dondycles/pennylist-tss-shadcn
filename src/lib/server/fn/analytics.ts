import { authMiddleware } from "@/lib/middleware/auth-guard";
import { createServerFn } from "@tanstack/react-start";
import { differenceInDays } from "date-fns";
import { getSupabaseServerClient } from "../supabase";

export const getAnalytics = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context: { user } }) => {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("log")
      .select("*, money!inner(*)")
      .eq("userId", user.id)
      .order("created_at", {
        ascending: false,
      });

    if (error) throw new Error(JSON.stringify(error, null, 2));

    const daysSinceJoined = differenceInDays(new Date(), new Date(user.created_at));

    function groupLogsByDate() {
      if (!data) return [];
      const groupedByDate: { [key: string]: typeof data } = {};
      data.forEach((log) => {
        const day = new Date(log.created_at).toLocaleDateString();
        if (!groupedByDate[day]) return (groupedByDate[day] = [log]);
        groupedByDate[day] = [...groupedByDate[day], log];
      });

      const dateJoined = new Date(user.created_at);
      const dataWithFilledDays: { date: string; logs: typeof data }[] = [];
      let log: (typeof dataWithFilledDays)[number] = {
        date: "",
        logs: [],
      };
      for (let i = 0; i <= daysSinceJoined; i++) {
        const day = dateJoined.toLocaleDateString();
        if (groupedByDate[day] !== undefined) {
          log = { date: day, logs: groupedByDate[day] };
        } else {
          const veryLastLog = log.logs.sort(
            (a, b) => new Date(b.created_at).getDate() - new Date(a.created_at).getDate(),
          )[0];
          log.date = day;
          log.logs = [
            {
              ...veryLastLog,
              changes: {
                current: {
                  amount: 0,
                  name: "",
                  totalMoney: log.logs[0].changes.current.totalMoney,
                },
                prev: { amount: 0, name: "", totalMoney: 0 },
              },
            },
          ];
        }
        dataWithFilledDays.push({ ...log });
        dateJoined.setDate(dateJoined.getDate() + 1);
      }

      const summary: {
        date: string;
        totalMoney: number;
        totalAdditions: number;
        totalDeductions: number;
      }[] = [];

      dataWithFilledDays.forEach((data) => {
        const totalMoney = data.logs.sort(
          (a, b) => new Date(b.created_at).getDate() - new Date(a.created_at).getDate(),
        )[0].changes.current.totalMoney;
        let totalAdditions = 0;
        let totalDeductions = 0;

        data.logs.forEach((log) => {
          if (log.changes.current.amount < log.changes.prev.amount) {
            totalDeductions =
              totalDeductions + (log.changes.prev.amount - log.changes.current.amount);
          } else {
            totalAdditions =
              totalAdditions + (log.changes.current.amount - log.changes.prev.amount);
          }
        });

        summary.push({
          date: data.date,
          totalMoney,
          totalAdditions,
          totalDeductions,
        });
      });

      return summary;
    }

    return groupLogsByDate();
  });
