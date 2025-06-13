import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Analytics } from "@/lib/server/fn/analytics";
import { Check } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./animate-ui/radix/dropdown-menu";
import { Button } from "./ui/button";

export const description = "A mixed bar chart";

const chartConfig = {
  "currentData.amount": {
    label: "Amount",
  },
  totalAdditions: {
    label: "Incomings",
    color: "var(--foreground)",
  },
  totalDeductions: {
    label: "Outgoings",
    color: "var(--foreground)",
  },
} satisfies ChartConfig;

export function MoneyBreakdownBarChart({ data }: { data: Analytics }) {
  const [type, setType] = useState<"incomings" | "outgoings" | "total">("total");
  return (
    <Card className="bg-transparent">
      <CardHeader className="flex items-center gap-2 space-y-0 p-0 px-4 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Money Breakdown</CardTitle>
          <CardDescription>
            {type === "total" && "Showing the current total of each money"}
            {type === "incomings" &&
              "Showing the record of total income gained by each money since added"}
            {type === "outgoings" &&
              "Showing the record of total money spent from each money since added"}
          </CardDescription>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger className="capitalize" asChild>
            <Button variant={"outline"}>{type}</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setType("total")}>
              <p className="flex-1 text-left">Total</p>
              {type === "total" ? <Check /> : null}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setType("incomings")}>
              <p className="flex-1 text-left">Incomings</p>
              {type === "incomings" ? <Check /> : null}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setType("outgoings")}>
              <p className="flex-1 text-left">Outgoings</p>
              {type === "outgoings" ? <Check /> : null}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-144 rounded-3xl border p-4"
        >
          <BarChart
            accessibilityLayer
            data={
              (type === "incomings" &&
                data.groupsLogsByMoney?.sort(
                  (a, b) => b.totalAdditions - a.totalAdditions,
                )) ||
              (type === "outgoings" &&
                data.groupsLogsByMoney?.sort(
                  (a, b) => b.totalDeductions - a.totalDeductions,
                )) ||
              (type === "total" &&
                data.groupsLogsByMoney?.sort(
                  (a, b) => b.currentData.amount - a.currentData.amount,
                )) ||
              []
            }
            layout="vertical"
            margin={{
              left: 24,
            }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="currentData.name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              type="category"
            />
            <XAxis
              tickLine={false}
              axisLine={false}
              type="number"
              tickFormatter={(value) =>
                Intl.NumberFormat("en-US", { style: "currency", currency: "PHP" }).format(
                  value,
                )
              }
            />

            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Bar
              hide={type !== "incomings"}
              dataKey="totalAdditions"
              layout="vertical"
              radius={5}
              isAnimationActive={false}
            />
            <Bar
              hide={type !== "outgoings"}
              dataKey="totalDeductions"
              layout="vertical"
              radius={5}
              isAnimationActive={false}
            />
            <Bar
              hide={type !== "total"}
              dataKey="currentData.amount"
              layout="vertical"
              radius={5}
              isAnimationActive={false}
            />
            {/* <ChartLegend content={<ChartLegendContent />} /> */}
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
