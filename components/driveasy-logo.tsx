export function DriveasyLogo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
  }

  return (
    <div className="flex items-center gap-3">
      <img src="/driveasy-logo.png" alt="Driveasy Logo" className={`${sizeClasses[size]} object-contain`} />
      <div className="hidden sm:block">
        <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
          Driveasy
        </h2>
        <p className="text-xs text-muted-foreground">Autonomous Driving Management</p>
      </div>
    </div>
  )
}
