"use client";

import { useState } from "react";

interface CarCalendarProps {
  blockedDates: string[];
  onChange: (dates: string[]) => void;
  readOnly?: boolean;
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function toISO(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function CarCalendar({ blockedDates, onChange, readOnly }: CarCalendarProps) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const todayISO = toISO(today.getFullYear(), today.getMonth(), today.getDate());

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();

  const prev = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1); }
    else setViewMonth(viewMonth - 1);
  };
  const next = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1); }
    else setViewMonth(viewMonth + 1);
  };

  const toggleDate = (iso: string) => {
    if (readOnly || iso < todayISO) return;
    if (blockedDates.includes(iso)) {
      onChange(blockedDates.filter((d) => d !== iso));
    } else {
      onChange([...blockedDates, iso]);
    }
  };

  return (
    <div className="w-full max-w-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <button type="button" onClick={prev} className="px-2 py-1 text-sm text-gray-600 hover:text-navy transition-colors">&larr;</button>
        <span className="text-sm font-bold text-gray-900">{MONTHS[viewMonth]} {viewYear}</span>
        <button type="button" onClick={next} className="px-2 py-1 text-sm text-gray-600 hover:text-navy transition-colors">&rarr;</button>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 gap-px mb-1">
        {DAYS.map((d) => (
          <div key={d} className="text-center text-[9px] font-bold uppercase tracking-wider text-gray-400 py-1">{d}</div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-px">
        {/* Empty cells for offset */}
        {Array.from({ length: firstDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} className="h-8" />
        ))}

        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const iso = toISO(viewYear, viewMonth, day);
          const isPast = iso < todayISO;
          const isBlocked = blockedDates.includes(iso);
          const isToday = iso === todayISO;

          return (
            <button
              key={day}
              type="button"
              onClick={() => toggleDate(iso)}
              disabled={readOnly || isPast}
              className={`h-8 text-xs font-medium rounded transition-all ${
                isPast
                  ? "text-gray-300 cursor-default"
                  : isBlocked
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-green-50 text-green-700 hover:bg-green-100"
              } ${isToday ? "ring-2 ring-navy ring-offset-1" : ""} ${
                !readOnly && !isPast ? "cursor-pointer" : ""
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-3 text-[10px] text-gray-500">
        <span className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 rounded bg-green-50 border border-green-200" /> Available
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 rounded bg-red-500" /> Blocked
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 rounded bg-gray-100" /> Past
        </span>
      </div>
    </div>
  );
}
