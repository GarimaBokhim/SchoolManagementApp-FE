"use client";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";

const mode = [
  { id: 1, name: "Attendance" },
  { id: 2, name: "Revenue" },
  { id: 3, name: "Income" },
];

const time = [
  { id: 1, name: "Today" },
  { id: 2, name: "This week" },
  { id: 3, name: "This Month" },
  { id: 4, name: "This Year" },
];
const modeColors: Record<string, string[]> = {
  Attendance: ["#34d399", "#10b981", "#059669", "#047857", "#065f46"],
  Revenue:    ["#60a5fa", "#3b82f6", "#2563eb", "#1d4ed8", "#1e40af"],
  Income:     ["#f472b6", "#ec4899", "#db2777", "#be185d", "#9d174d"],
};

export default function BarChartSection() {
  const [selectedMode, setSelectedMode] = useState(mode[0]);
  const [selectedTime, setSelectedTime] = useState(time[0]);

  const chartData = useMemo(() => {
    switch (selectedMode.name) {
      case "Attendance":
        if (selectedTime.name === "Today") {
          return [
            { name: "10 AM", value: 30 },
            { name: "12 PM", value: 45 },
            { name: "2 PM",  value: 20 },
            { name: "4 PM",  value: 60 },
          ];
        } else if (selectedTime.name === "This week") {
          return [
            { name: "Mon", value: 120 },
            { name: "Tue", value: 150 },
            { name: "Wed", value: 80  },
            { name: "Thu", value: 170 },
            { name: "Fri", value: 200 },
          ];
        } else if (selectedTime.name === "This Month") {
          return [
            { name: "Week 1", value: 500 },
            { name: "Week 2", value: 650 },
            { name: "Week 3", value: 420 },
            { name: "Week 4", value: 700 },
          ];
        } else {
          return [
            { name: "Q1", value: 1200 },
            { name: "Q2", value: 1450 },
            { name: "Q3", value: 980  },
            { name: "Q4", value: 1600 },
          ];
        }

      case "Revenue":
        if (selectedTime.name === "Today") {
          return [
            { name: "10 AM", value: 300 },
            { name: "12 PM", value: 450 },
            { name: "2 PM",  value: 200 },
            { name: "4 PM",  value: 600 },
          ];
        } else if (selectedTime.name === "This week") {
          return [
            { name: "Mon", value: 1200 },
            { name: "Tue", value: 1500 },
            { name: "Wed", value: 800  },
            { name: "Thu", value: 1700 },
            { name: "Fri", value: 2000 },
          ];
        } else if (selectedTime.name === "This Month") {
          return [
            { name: "Week 1", value: 50002 },
            { name: "Week 2", value: 65000 },
            { name: "Week 3", value: 42000 },
            { name: "Week 4", value: 70021 },
          ];
        } else {
          return [
            { name: "Q1", value: 120021 },
            { name: "Q2", value: 145034 },
            { name: "Q3", value: 98021  },
            { name: "Q4", value: 160031 },
          ];
        }

      case "Income":
        if (selectedTime.name === "This Month") {
          return [
            { name: "Week 1", value: 5000 },
            { name: "Week 2", value: 6500 },
            { name: "Week 3", value: 4200 },
            { name: "Week 4", value: 7000 },
          ];
        } else {
          return [
            { name: "Q1", value: 12000 },
            { name: "Q2", value: 14500 },
            { name: "Q3", value: 9800  },
            { name: "Q4", value: 16000 },
          ];
        }

      default:
        return [];
    }
  }, [selectedMode, selectedTime]);
  const colors = modeColors[selectedMode.name] ?? modeColors.Attendance;

  return (
    <div className="w-full text-text rounded-lg shadow-md p-4 pr-8 border border-[#035BBA] h-full dark:bg-[#171717]">
      {/* Controls row */}
      <div className="flex items-center justify-between mb-3 h-[10%]">
        <Listbox value={selectedMode} onChange={setSelectedMode}>
          <div className="relative">
            <ListboxButton className="flex space-x-1 justify-center items-center border border-[#035BBA] px-3 py-1 rounded text-[#035BBA] font-normal text-sm focus:outline-none">
              <span>{selectedMode.name}</span>
              <ChevronDown className="pointer-events-none size-4" />
            </ListboxButton>
            <ListboxOptions
              anchor="bottom"
              className="mt-2 shadow-xl rounded bg-white dark:bg-[#1f1f1f] z-10"
            >
              {mode.map((m) => (
                <ListboxOption
                  key={m.id}
                  value={m}
                  className="data-[focus]:bg-[#CCE3FC] dark:data-[focus]:bg-[#1e3a5f] rounded px-6 flex justify-center cursor-pointer text-sm p-1"
                >
                  {m.name}
                </ListboxOption>
              ))}
            </ListboxOptions>
          </div>
        </Listbox>

        <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
          Chart
        </span>

        <Listbox value={selectedTime} onChange={setSelectedTime}>
          <div className="relative">
            <ListboxButton className="flex space-x-1 justify-center items-center border border-[#035BBA] px-3 py-1 rounded text-[#035BBA] font-normal text-sm focus:outline-none">
              <span>{selectedTime.name}</span>
              <ChevronDown className="pointer-events-none size-4" />
            </ListboxButton>
            <ListboxOptions
              anchor="bottom"
              className="mt-2 shadow-xl bg-white dark:bg-[#1f1f1f] z-10"
            >
              {time.map((t) => (
                <ListboxOption
                  key={t.id}
                  value={t}
                  className="data-[focus]:bg-[#CCE3FC] dark:data-[focus]:bg-[#1e3a5f] rounded px-6 flex justify-center cursor-pointer text-sm p-1"
                >
                  {t.name}
                </ListboxOption>
              ))}
            </ListboxOptions>
          </div>
        </Listbox>
      </div>

      {/* Chart area */}
      <div className="mt-2 h-[85%] w-full">
        <ChartContainer
          className="h-full w-full"
          config={{
            value: {
              label: selectedMode.name,
              color: colors[0],
            },
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={48}
              />
              <ChartTooltip cursor={{ fill: "rgba(0,0,0,0.04)" }} content={<ChartTooltipContent />} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {chartData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[index % colors.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );
}