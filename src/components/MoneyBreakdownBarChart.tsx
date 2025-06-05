import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";

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
  return (
    <Card className="bg-transparent">
      <CardHeader>
        <CardTitle>Money Breakdown</CardTitle>
        <CardDescription>Showing what money is dominant</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-144 rounded-3xl border p-4"
        >
          <BarChart
            accessibilityLayer
            data={
              data.groupsLogsByMoney?.sort(
                (a, b) => b.currentData.amount - a.currentData.amount,
              ) ?? []
            }
            layout="vertical"
            margin={{
              left: 0,
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
              fill="var(--chart-totalAdditions)"
              dataKey="totalAdditions"
              layout="vertical"
              radius={5}
            />
            <Bar
              fill="var(--chart-totalDeductions)"
              dataKey="totalDeductions"
              layout="vertical"
              radius={5}
            />

            <Bar dataKey="currentData.amount" layout="vertical" radius={5}>
              {data.groupsLogsByMoney
                ?.sort((a, b) => b.currentData.amount - a.currentData.amount)
                .map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.currentData.color ?? "var(--foreground)"}
                  />
                ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
