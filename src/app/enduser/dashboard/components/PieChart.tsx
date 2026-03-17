"use client";
import { TrendingUp } from "lucide-react";
import { Pie, PieChart, Sector } from "recharts";
import { PieSectorDataItem } from "recharts/types/polar/Pie";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "A donut chart with an active sector";

const chartData = [
  { browser: "Reliance",        visitors: 275, fill: "#C5EACC" },
  { browser: "Damak Technical", visitors: 200, fill: "#F6D1B5" },
  { browser: "Sidhartha",       visitors: 187, fill: "#C2D4FB" },
  { browser: "Mother",          visitors: 173, fill: "#F3C2C2" },
  { browser: "Other",           visitors: 90,  fill: "#D1D5DB" },
];

const chartConfig = {
  visitors: { label: "Visitors" },
  reliance:       { label: "Reliance",        color: "var(--chart-1)" },
  damakTechnical: { label: "Damak Technical", color: "var(--chart-2)" },
  sidhartha:      { label: "Sidhartha",       color: "var(--chart-3)" },
  mother:         { label: "Mother",          color: "var(--chart-4)" },
  other:          { label: "Other",           color: "var(--chart-5)" },
} satisfies ChartConfig;

export default function PieChartSection() {
  return (
    <div className="w-full bg-white dark:bg-[#171717] text-text rounded-lg shadow-md border border-green-700 h-full flex flex-col overflow-hidden">
      <Card className="flex flex-col h-full border-none shadow-none bg-transparent">
        <CardHeader className="items-center pb-1 pt-4 px-4">
          <CardTitle className="text-sm font-bold tracking-wide">System Activity</CardTitle>
          <CardDescription className="text-[11px]">Jan – Jun 2024</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0 flex items-center justify-center">
          <ChartContainer
            config={chartConfig}
            className="w-full"
            style={{ maxHeight: "160px" }}
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={chartData}
                dataKey="visitors"
                nameKey="browser"
                innerRadius={45}
                outerRadius={70}
                strokeWidth={4}
                activeIndex={0}
                activeShape={({
                  outerRadius = 0,
                  ...props
                }: PieSectorDataItem) => (
                  <Sector {...props} outerRadius={outerRadius + 8} />
                )}
              />
            </PieChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col gap-1 text-xs pb-4 px-4">
          <div className="flex items-center gap-1 font-medium leading-none">
            Trending up 5.2% this month
            <TrendingUp className="h-3 w-3 text-green-500" />
          </div>
          <div className="text-muted-foreground leading-none text-center">
            Total revenue (last 6 months)
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}