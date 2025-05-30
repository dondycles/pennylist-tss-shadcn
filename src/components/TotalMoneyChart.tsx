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
import { Analytics } from "@/lib/server/fn/analytics";
import { differenceInCalendarDays } from "date-fns";
import { Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./animate-ui/radix/dropdown-menu";
import { Button } from "./ui/button";

const chartConfig = {
  totalMoney: {
    label: "Total",
  },
  totalAdditions: {
    label: "Incomings",
  },
  totalDeductions: {
    label: "Outgoings",
  },
} satisfies ChartConfig;

export function TotalMoneyChart({
  data,
  dateJoined,
}: {
  data: Analytics;
  dateJoined: Date;
}) {
  type FilterState =
    | { type: "monthly"; freq?: "sincejoined" }
    | { type: "daily"; freq: "7" | "30" | "sincejoined" };

  const [filter, setFilter] = React.useState<FilterState>({
    type: "daily",
    freq: "7",
  });
  const filteredData =
    filter.type === "monthly"
      ? data.groupLogsByMonth
      : data.groupLogsByDate?.filter((item) => {
          const date = new Date(item.date);
          const referenceDate = new Date();
          let daysToSubtract = differenceInCalendarDays(new Date(), dateJoined);
          if (filter.freq === "30") {
            daysToSubtract = 30 < daysToSubtract ? 30 : daysToSubtract;
          } else if (filter.freq === "7") {
            daysToSubtract = 7 < daysToSubtract ? 7 : daysToSubtract;
          }
          const startDate = new Date(referenceDate);
          startDate.setDate(startDate.getDate() - daysToSubtract);
          return date >= startDate;
        });
  return (
    <Card className="bg-transparent p-0 pb-4">
      <CardHeader className="flex items-center gap-2 space-y-0 p-0 px-4 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Changes</CardTitle>
          <CardDescription>
            Showing the flow of your incoming, outgoing, and total money.
          </CardDescription>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger className="capitalize" asChild>
            <Button variant={"outline"}>{filter.type}</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => setFilter({ type: "daily", freq: "7" })}>
                <p className="flex-1">Daily</p>
                {filter.type === "daily" ? <Check /> : null}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setFilter({ type: "monthly", freq: "sincejoined" })}
              >
                <p className="flex-1"> Monthly</p>
                {filter.type === "monthly" ? <Check /> : null}
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => setFilter({ freq: "7", type: "daily" })}
                hidden={filter.type === "monthly"}
              >
                <p className="flex-1">7</p>
                {filter.type === "daily" && filter.freq === "7" ? <Check /> : null}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setFilter({ freq: "30", type: "daily" })}
                hidden={filter.type === "monthly"}
              >
                <p className="flex-1">30</p>
                {filter.type === "daily" && filter.freq === "30" ? <Check /> : null}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setFilter({ freq: "sincejoined", type: filter.type })}
              >
                <p className="flex-1">Since Joined</p>
                {filter.freq === "sincejoined" ? <Check /> : null}
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="rounded-full sm:ml-auto" aria-label="Select a value">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="sincejoined" className="rounded-lg">
              By Days Since Joined
            </SelectItem>
            <SelectItem value="monthssincejoined" className="rounded-lg">
              By Months Since Joined
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select> */}
      </CardHeader>
      <CardContent>
        {!filteredData ? (
          <p className="text-muted-foreground text-center text-sm">
            No data to show as of now
          </p>
        ) : (
          <>
            <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
              <AreaChart data={filteredData}>
                <defs>
                  <linearGradient id="totalMoney" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--chart-totalMoney)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--chart-totalMoney)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} />
                <XAxis
                  hide
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString("en-US", {
                      month: "short",
                      day: filter.type === "monthly" ? undefined : "numeric",
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
                          day: filter.type === "monthly" ? undefined : "numeric",
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
                  isAnimationActive={false}
                  type="bump"
                />

                <ChartLegend content={<ChartLegendContent />} />
              </AreaChart>
            </ChartContainer>
            <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
              <AreaChart data={filteredData}>
                <defs>
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
                </defs>
                <CartesianGrid vertical={false} />
                <XAxis
                  hide
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString("en-US", {
                      month: "short",
                      day: filter.type === "monthly" ? undefined : "numeric",
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
                          day: filter.type === "monthly" ? undefined : "numeric",
                        });
                      }}
                      indicator="dot"
                    />
                  }
                />

                <Area
                  dataKey="totalAdditions"
                  stroke="var(--chart-totalAdditions)"
                  fill="url(#totalAdditions)"
                  stackId="b"
                  isAnimationActive={false}
                  type="bump"
                />

                <ChartLegend content={<ChartLegendContent />} />
              </AreaChart>
            </ChartContainer>
            <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
              <AreaChart data={filteredData}>
                <defs>
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
                      day: filter.type === "monthly" ? undefined : "numeric",
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
                          day: filter.type === "monthly" ? undefined : "numeric",
                        });
                      }}
                      indicator="dot"
                    />
                  }
                />

                <Area
                  dataKey="totalDeductions"
                  stroke="var(--chart-totalDeductions)"
                  fill="url(#totalDeductions)"
                  stackId="c"
                  isAnimationActive={false}
                  type="bump"
                />

                <ChartLegend content={<ChartLegendContent />} />
              </AreaChart>
            </ChartContainer>
          </>
        )}
      </CardContent>
    </Card>
  );
}
