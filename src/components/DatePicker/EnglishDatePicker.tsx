"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Example placeholder functions for date parsing
function parseTypedDate(dateStr: string) {
  const [y, m, d] = dateStr.split("-").map(Number);
  if (!y || !m || !d) return null;
  return {
    year: y,
    month: String(m).padStart(2, "0"),
    day: String(d).padStart(2, "0"),
  };
}

function getFullEnglishDate(dateStr: string) {
  return dateStr;
}

interface Props {
  label: string;
  maxDate?: string;
  minDate?: string;
  isExpiryDate?: boolean;
  defaultDate?: string;
  name: string;
  onChange: (val: string) => void;
  error?: boolean;
}

export default function EnglishDatePicker({
  label,
  name,
  onChange,
  maxDate = "",
  minDate = "",
  defaultDate,
  isExpiryDate,
  error,
}: Props) {
  const [selectedDate, setSelectedDate] = useState(defaultDate);
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentYear, setCurrentYear] = useState(2025);
  const [currentMonth, setCurrentMonth] = useState(6);
  const [currentDay, setCurrentDay] = useState(1);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/[^\d]/g, "");
    if (raw.length > 8) raw = raw.slice(0, 8);

    const year = raw.slice(0, 4);
    let month = raw.slice(4, 6);
    let day = raw.slice(6, 8);

    if (month.length === 1 && parseInt(month) > 1) month = "0" + month;
    if (month && (parseInt(month) < 1 || parseInt(month) > 12)) month = "12";

    if (day.length === 1 && parseInt(day) > 3) day = "0" + day;
    if (day && (parseInt(day) < 1 || parseInt(day) > 32)) day = "32";

    let formatted = year;
    if (month) formatted += "-" + month;
    if (day) formatted += "-" + day;

    setSelectedDate(formatted);

    if (formatted.length === 10) {
      const parsed = parseTypedDate(formatted);
      if (!parsed) return;

      const { year, month, day } = parsed;

      setCurrentYear(Number(year));
      setCurrentMonth(Number(month));
      setCurrentDay(Number(day));
      setShowCalendar(false);

      onChange(getFullEnglishDate(`${year}-${month}-${day}`));
    }
  };

  return (
    <div className="flex flex-col gap-3 relative">
      <Label
        htmlFor={name}
        className={`absolute left-1 flex pt-1 bg-[#FBFBFB] items-center scale-90 peer-placeholder-shown:scale-100 -top-[0.8rem] px-2 origin-left text-gray-500 transition-all pointer-events-none`}
      >
        {label}
      </Label>
      <div className="relative flex gap-2">
        <Input
          id={name}
          value={selectedDate}
          placeholder="Enter a date"
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setShowCalendar(true);
            }
          }}
          className={`w-full p-2 py-[1.4rem] border rounded-md outline-none peer bg-[#FBFBFB] ${
            error ? "border-red-500" : "border-gray-400"
          } dark:text-white dark:bg-[#27272a] focus:border-[#14b8a6]`}
        />
        <Popover open={showCalendar} onOpenChange={setShowCalendar}>
          <PopoverTrigger asChild>
            <Button
              id="date-picker"
              variant="ghost"
              className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
            >
              <CalendarIcon className="size-3.5" />
              <span className="sr-only">Select date</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto overflow-hidden p-0"
            align="end"
            alignOffset={-8}
            sideOffset={10}
          >
            <Calendar
              mode="single"
              selected={new Date(currentYear, currentMonth - 1, currentDay)}
              disabled={
                !isExpiryDate
                  ? (date) => {
                      const min = minDate
                        ? new Date(minDate)
                        : new Date("1900-01-01");
                      const max = maxDate ? new Date(maxDate) : new Date();
                      return date < min || date > max;
                    }
                  : undefined
              }
              onSelect={(date) => {
                if (date) {
                  const y = date.getFullYear();
                  const m = String(date.getMonth() + 1).padStart(2, "0");
                  const d = String(date.getDate()).padStart(2, "0");
                  const val = `${y}-${m}-${d}`;
                  setSelectedDate(val);
                  setCurrentYear(y);
                  setCurrentMonth(Number(m));
                  setCurrentDay(Number(d));
                  setShowCalendar(false);
                  onChange(getFullEnglishDate(val));
                }
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
