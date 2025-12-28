"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, ChevronLeft, ChevronRight, Check, Package, CreditCard } from "lucide-react"
import { cn } from "@/lib/utils"
import { DEFAULT_PACKAGES, formatPrice } from "@/lib/lesson-packages"

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
  const router = useRouter()
  const [weekOffset, setWeekOffset] = useState(0)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null)
  const [step, setStep] = useState<"package" | "datetime" | "confirm">("package")

  const days = generateDays(weekOffset)
  const weekStart = days[0]
  const weekEnd = days[6]

  const selectedPkg = DEFAULT_PACKAGES.find((p) => p.id === selectedPackage)

  const handleProceedToPayment = () => {
    if (!selectedPackage || !selectedDate || !selectedSlot) return

    const params = new URLSearchParams({
      package: selectedPackage,
      date: selectedDate.toISOString(),
      slot: selectedSlot,
    })

    router.push(`/portal/book/checkout?${params.toString()}`)
  }

  return (
    <div className="space-y-6 py-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Book a Lesson</h1>
        <p className="text-muted-foreground mt-1">
          {step === "package" && "Select a lesson package"}
          {step === "datetime" && "Choose your preferred date and time"}
          {step === "confirm" && "Review and confirm your booking"}
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-2">
        {["package", "datetime", "confirm"].map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium",
                step === s
                  ? "bg-primary text-primary-foreground"
                  : ["package", "datetime", "confirm"].indexOf(step) > i
                    ? "bg-primary/20 text-primary"
                    : "bg-secondary text-muted-foreground",
              )}
            >
              {i + 1}
            </div>
            {i < 2 && (
              <div
                className={cn(
                  "h-0.5 w-8",
                  ["package", "datetime", "confirm"].indexOf(step) > i ? "bg-primary" : "bg-secondary",
                )}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Package Selection */}
      {step === "package" && (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {DEFAULT_PACKAGES.map((pkg) => (
              <button
                key={pkg.id}
                onClick={() => setSelectedPackage(pkg.id)}
                className={cn(
                  "rounded-xl border p-5 text-left transition-all",
                  selectedPackage === pkg.id
                    ? "border-primary bg-primary/5 ring-2 ring-primary"
                    : "border-border bg-card hover:border-primary/50",
                )}
              >
                <div className="flex items-start justify-between">
                  <Package className="h-5 w-5 text-primary" />
                  {pkg.savings > 0 && (
                    <span className="rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success">
                      Save £{formatPrice(pkg.savings)}
                    </span>
                  )}
                </div>
                <h3 className="mt-3 font-semibold text-foreground">{pkg.name}</h3>
                <p className="text-sm text-muted-foreground">{pkg.description}</p>
                <div className="mt-4">
                  <span className="text-2xl font-bold text-foreground">£{formatPrice(pkg.priceInPence)}</span>
                  <span className="text-sm text-muted-foreground ml-1">
                    (£{(pkg.priceInPence / pkg.hours / 100).toFixed(2)}/hr)
                  </span>
                </div>
              </button>
            ))}
          </div>
          <div className="flex justify-end">
            <Button onClick={() => setStep("datetime")} disabled={!selectedPackage}>
              Continue to Date Selection
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Date/Time Selection */}
      {step === "datetime" && (
        <div className="space-y-6">
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

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setStep("package")}>
              Back
            </Button>
            <Button onClick={() => setStep("confirm")} disabled={!selectedDate || !selectedSlot}>
              Review Booking
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Confirmation */}
      {step === "confirm" && selectedPkg && selectedDate && selectedSlot && (
        <div className="space-y-6">
          <div className="rounded-xl border border-primary/30 bg-primary/5 p-6">
            <h2 className="font-semibold text-foreground flex items-center gap-2 mb-4">
              <Calendar className="h-5 w-5 text-primary" />
              Booking Summary
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Package</span>
                <span className="font-medium text-foreground">{selectedPkg.name}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Date</span>
                <span className="font-medium text-foreground">
                  {selectedDate.toLocaleDateString("en-GB", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Time</span>
                <span className="font-medium text-foreground">
                  {timeSlots.find((s) => s.id === selectedSlot)?.time}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Duration</span>
                <span className="font-medium text-foreground">{selectedPkg.hours} hours</span>
              </div>
              {selectedPkg.savings > 0 && (
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Savings</span>
                  <span className="font-medium text-success">-£{formatPrice(selectedPkg.savings)}</span>
                </div>
              )}
              <div className="flex justify-between py-3">
                <span className="text-lg font-semibold text-foreground">Total</span>
                <span className="text-2xl font-bold text-foreground">£{formatPrice(selectedPkg.priceInPence)}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setStep("datetime")}>
              Back
            </Button>
            <Button onClick={handleProceedToPayment} className="gap-2">
              <CreditCard className="h-4 w-4" />
              Proceed to Payment
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
