export interface LessonPackage {
  id: string
  name: string
  hours: number
  priceInPence: number // Price in pence (e.g., 3400 for £34.00)
  savings: number // Savings amount in pence
  description: string
}

// Default lesson packages
export const DEFAULT_PACKAGES: LessonPackage[] = [
  {
    id: "single-lesson",
    name: "Single Lesson",
    hours: 1,
    priceInPence: 3400, // £34.00
    savings: 0,
    description: "1 hour of driving instruction",
  },
  {
    id: "double-lesson",
    name: "Double Lesson",
    hours: 2,
    priceInPence: 6800, // £68.00
    savings: 0,
    description: "2 hours of driving instruction",
  },
  {
    id: "5-lesson-package",
    name: "5-Lesson Package",
    hours: 10,
    priceInPence: 32000, // £320.00 (£6.40/hour savings)
    savings: 3000, // Save £30
    description: "10 hours of driving instruction",
  },
  {
    id: "10-lesson-package",
    name: "10-Lesson Package",
    hours: 20,
    priceInPence: 62000, // £620.00 (£6.20/hour savings)
    savings: 6000, // Save £60
    description: "20 hours of driving instruction",
  },
  {
    id: "20-lesson-package",
    name: "20-Lesson Package",
    hours: 40,
    priceInPence: 120000, // £1,200.00 (£6/hour savings)
    savings: 13600, // Save £136
    description: "40 hours of driving instruction",
  },
]

export function getPackageById(packageId: string): LessonPackage | undefined {
  return DEFAULT_PACKAGES.find((pkg) => pkg.id === packageId)
}

export function formatPrice(priceInPence: number): string {
  return (priceInPence / 100).toFixed(2)
}

export function getPricePerHour(packageId: string): string | null {
  const pkg = getPackageById(packageId)
  if (!pkg) return null
  const pricePerHour = pkg.priceInPence / (pkg.hours * 100)
  return pricePerHour.toFixed(2)
}
