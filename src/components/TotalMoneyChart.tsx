"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { differenceInDays } from "date-fns";

const chartConfig = {
  totalMoney: {
    label: "Money",
  },
  totalAdditions: {
    label: "Credit",
  },
  totalDeductions: {
    label: "Debit",
  },
} satisfies ChartConfig;

export function TotalMoneyChart({
  data,
  dateJoined,
}: {
  data: {
    date: string;
    totalMoney: number;
    totalAdditions: number;
    totalDeductions: number;
  }[];
  dateJoined: Date;
}) {
  const [timeRange, setTimeRange] = React.useState("90d");

  const filteredData = data.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date();
    let daysToSubtract = differenceInDays(new Date(), dateJoined);
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });
  return (
    <Card className="border-b py-4 shadow-none">
      <CardHeader className="flex items-center gap-2 space-y-0 p-0 px-4 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Total Money</CardTitle>
          <CardDescription>
            Showing total money each day since joined{" "}
            {differenceInDays(new Date(), dateJoined)}
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d" className="rounded-lg">
              Since Joined
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="totalMoney" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--chart-totalMoney)" stopOpacity={0.8} />
                <stop
                  offset="95%"
                  stopColor="var(--chart-totalMoney)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="totalAdditions" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--chart-totalAdditions)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--chart-totalAdditions)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="totalDeductions" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--chart-totalDeductions)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--chart-totalDeductions)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="totalMoney"
              stroke="var(--chart-totalMoney)"
              fill="url(#totalMoney)"
              stackId="a"
            />
            <Area
              dataKey="totalAdditions"
              stroke="var(--chart-totalAdditions)"
              fill="url(#totalAdditions)"
              stackId="b"
            />
            <Area
              dataKey="totalDeductions"
              stroke="var(--chart-totalDeductions)"
              fill="url(#totalDeductions)"
              stackId="c"
            />

            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
