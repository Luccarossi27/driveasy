"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, ChevronLeft, ChevronRight, Check } from "lucide-react"
import { cn } from "@/lib/utils"

const timeSlots = [
  { id: "1", time: "09:00 - 11:00", available: true },
  { id: "2", time: "11:30 - 13:30", available: false },
  { id: "3", time: "14:00 - 16:00", available: true },
  { id: "4", time: "16:30 - 18:30", available: true },
]

const generateDays = (weekOffset: number) => {
  const today = new Date()
  const startOfWeek = new Date(today)
  startOfWeek.setDate(today.getDate() - today.getDay() + 1 + weekOffset * 7)

  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startOfWeek)
    date.setDate(startOfWeek.getDate() + i)
    return {
      date,
      dayName: date.toLocaleDateString("en-GB", { weekday: "short" }),
      dayNumber: date.getDate(),
      month: date.toLocaleDateString("en-GB", { month: "short" }),
      isPast: date < today && date.toDateString() !== today.toDateString(),
      isToday: date.toDateString() === today.toDateString(),
    }
  })
}

export default function BookLessonPage() {
  const [weekOffset, setWeekOffset] = useState(0)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [isConfirmed, setIsConfirmed] = useState(false)

  const days = generateDays(weekOffset)
  const weekStart = days[0]
  const weekEnd = days[6]

  const handleConfirmBooking = () => {
    setIsConfirmed(true)
  }

  if (isConfirmed) {
    return (
      <div className="space-y-6 py-4">
        <div className="rounded-xl border border-success/30 bg-success/5 p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
            <Check className="h-8 w-8 text-success" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Lesson Booked!</h1>
          <p className="text-muted-foreground mb-4">
            Your lesson has been confirmed for{" "}
            <span className="font-semibold text-foreground">
              {selectedDate?.toLocaleDateString("en-GB", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </span>{" "}
            at{" "}
            <span className="font-semibold text-foreground">{timeSlots.find((s) => s.id === selectedSlot)?.time}</span>
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            You'll receive a confirmation email shortly with all the details.
          </p>
          <Button
            onClick={() => {
              setIsConfirmed(false)
              setSelectedDate(null)
              setSelectedSlot(null)
            }}
          >
            Book Another Lesson
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 py-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Book a Lesson</h1>
        <p className="text-muted-foreground mt-1">Select a date and time for your next driving lesson</p>
      </div>

      {/* Week Navigation */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setWeekOffset(weekOffset - 1)}
            disabled={weekOffset <= 0}
            className="p-2 rounded-lg hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="font-semibold text-foreground">
            {weekStart.dayNumber} {weekStart.month} - {weekEnd.dayNumber} {weekEnd.month}
          </span>
          <button
            onClick={() => setWeekOffset(weekOffset + 1)}
            disabled={weekOffset >= 3}
            className="p-2 rounded-lg hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Date Selection */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((day) => (
            <button
              key={day.date.toISOString()}
              disabled={day.isPast}
              onClick={() => {
                setSelectedDate(day.date)
                setSelectedSlot(null)
              }}
              className={cn(
                "flex flex-col items-center p-2 sm:p-3 rounded-lg transition-colors",
                day.isPast && "opacity-40 cursor-not-allowed",
                day.isToday && "ring-2 ring-primary/50",
                selectedDate?.toDateString() === day.date.toDateString()
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-secondary",
              )}
            >
              <span className="text-xs font-medium opacity-70">{day.dayName}</span>
              <span className="text-lg font-bold">{day.dayNumber}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Time Slots */}
      {selectedDate && (
        <div className="rounded-xl border border-border bg-card p-4">
          <h2 className="font-semibold text-foreground flex items-center gap-2 mb-4">
            <Clock className="h-5 w-5 text-primary" />
            Available Times for{" "}
            {selectedDate.toLocaleDateString("en-GB", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {timeSlots.map((slot) => (
              <button
                key={slot.id}
                disabled={!slot.available}
                onClick={() => setSelectedSlot(slot.id)}
                className={cn(
                  "flex items-center justify-between p-4 rounded-lg border transition-colors",
                  !slot.available && "opacity-40 cursor-not-allowed border-border bg-secondary/50",
                  slot.available && selectedSlot === slot.id
                    ? "border-primary bg-primary/10"
                    : slot.available && "border-border hover:border-primary/50 hover:bg-secondary",
                )}
              >
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium text-foreground">{slot.time}</span>
                </div>
                {slot.available ? (
                  selectedSlot === slot.id && <Check className="h-5 w-5 text-primary" />
                ) : (
                  <span className="text-xs text-muted-foreground">Booked</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Booking Summary */}
      {selectedDate && selectedSlot && (
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
          <h2 className="font-semibold text-foreground flex items-center gap-2 mb-3">
            <Calendar className="h-5 w-5 text-primary" />
            Booking Summary
          </h2>
          <div className="space-y-2 text-sm mb-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date</span>
              <span className="font-medium text-foreground">
                {selectedDate.toLocaleDateString("en-GB", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Time</span>
              <span className="font-medium text-foreground">{timeSlots.find((s) => s.id === selectedSlot)?.time}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Duration</span>
              <span className="font-medium text-foreground">2 hours</span>
            </div>
            <div className="flex justify-between border-t border-border pt-2 mt-2">
              <span className="text-muted-foreground">Cost</span>
              <span className="font-bold text-foreground">£68.00</span>
            </div>
          </div>
          <Button className="w-full" onClick={handleConfirmBooking}>
            Confirm Booking
          </Button>
        </div>
      )}
    </div>
  )
}
