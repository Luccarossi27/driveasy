"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { User, Shield, Bell, CreditCard, FileText, Lock, LogOut, ChevronRight, Check, AlertCircle } from "lucide-react"

export default function SettingsPage() {
  const [profile, setProfile] = useState({
    fullName: "Mike Harrison",
    email: "mike.harrison@example.com",
    phone: "+44 7700 900123",
    postcode: "M1 1AA",
    licenceNumber: "HARRI751234MC9EW",
    licenceExpiry: "2029-12-31",
    vehicleReg: "AB21 XYZ",
    vehicleInsurance: "2025-06-30",
  })

  const [notifications, setNotifications] = useState({
    lessonReminders: true,
    paymentAlerts: true,
    newStudentRequests: true,
    reviewNotifications: true,
    promotions: false,
  })

  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleProfileChange = (field: string, value: string) => {
    setProfile({ ...profile, [field]: value })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your account, profile, and sensitive information</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-secondary">
          <TabsTrigger value="profile" className="data-[state=active]:bg-card">
            <User className="mr-2 h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="documentation" className="data-[state=active]:bg-card">
            <FileText className="mr-2 h-4 w-4" />
            Documentation
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-card">
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-card">
            <Shield className="mr-2 h-4 w-4" />
            Security
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          {/* Profile Header */}
          <div className="rounded-xl border border-border bg-card p-6 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-3xl font-bold text-primary">
              MH
            </div>
            <h2 className="text-xl font-bold text-foreground">{profile.fullName}</h2>
            <p className="text-muted-foreground">Verified Driving Instructor</p>
          </div>

          {/* Personal Information */}
          <div className="rounded-xl border border-border bg-card p-6 space-y-4">
            <h3 className="font-semibold text-foreground flex items-center gap-2 mb-4">
              <User className="h-5 w-5 text-primary" />
              Personal Information
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="fullname">Full Name</Label>
                <Input
                  id="fullname"
                  value={profile.fullName}
                  onChange={(e) => handleProfileChange("fullName", e.target.value)}
                  className="bg-secondary mt-1"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => handleProfileChange("email", e.target.value)}
                  className="bg-secondary mt-1"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => handleProfileChange("phone", e.target.value)}
                  className="bg-secondary mt-1"
                />
              </div>
              <div>
                <Label htmlFor="postcode">Postcode</Label>
                <Input
                  id="postcode"
                  value={profile.postcode}
                  onChange={(e) => handleProfileChange("postcode", e.target.value)}
                  className="bg-secondary mt-1"
                />
              </div>
            </div>
            <Button onClick={handleSave} className="w-full">
              {saved ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Saved
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </TabsContent>

        {/* Documentation Tab - Sensitive Info */}
        <TabsContent value="documentation" className="space-y-6">
          <div className="rounded-xl border border-warning/30 bg-warning/5 p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-warning">Sensitive Information</p>
              <p className="text-muted-foreground mt-1">
                These details are private and only visible to you. Keep them secure.
              </p>
            </div>
          </div>

          {/* Driving Licence */}
          <div className="rounded-xl border border-border bg-card p-6 space-y-4">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Driving Licence Details
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="licence">Licence Number</Label>
                <Input
                  id="licence"
                  value={profile.licenceNumber}
                  onChange={(e) => handleProfileChange("licenceNumber", e.target.value)}
                  className="bg-secondary mt-1 font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground mt-1">Your DVLA licence reference</p>
              </div>
              <div>
                <Label htmlFor="licenceExpiry">Expiry Date</Label>
                <Input
                  id="licenceExpiry"
                  type="date"
                  value={profile.licenceExpiry}
                  onChange={(e) => handleProfileChange("licenceExpiry", e.target.value)}
                  className="bg-secondary mt-1"
                />
                <p className="text-xs text-success mt-1">
                  Valid until{" "}
                  {new Date(profile.licenceExpiry).toLocaleDateString("en-GB", { year: "numeric", month: "long" })}
                </p>
              </div>
            </div>
          </div>

          {/* Vehicle Information */}
          <div className="rounded-xl border border-border bg-card p-6 space-y-4">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Vehicle Information
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="reg">Registration Number</Label>
                <Input
                  id="reg"
                  value={profile.vehicleReg}
                  onChange={(e) => handleProfileChange("vehicleReg", e.target.value)}
                  className="bg-secondary mt-1 font-mono text-sm"
                />
              </div>
              <div>
                <Label htmlFor="insurance">Insurance Expiry</Label>
                <Input
                  id="insurance"
                  type="date"
                  value={profile.vehicleInsurance}
                  onChange={(e) => handleProfileChange("vehicleInsurance", e.target.value)}
                  className="bg-secondary mt-1"
                />
                <p className="text-xs text-success mt-1">
                  Valid until{" "}
                  {new Date(profile.vehicleInsurance).toLocaleDateString("en-GB", { year: "numeric", month: "long" })}
                </p>
              </div>
            </div>
          </div>

          {/* Documentation Checklist */}
          <div className="rounded-xl border border-success/30 bg-success/5 p-6 space-y-4">
            <h3 className="font-semibold text-foreground">Documentation Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-card rounded-lg border border-border">
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-success" />
                  <span className="font-medium text-foreground">Driving Licence</span>
                </div>
                <span className="text-xs text-success">Valid</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-card rounded-lg border border-border">
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-success" />
                  <span className="font-medium text-foreground">Vehicle Insurance</span>
                </div>
                <span className="text-xs text-success">Valid</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-card rounded-lg border border-border">
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-success" />
                  <span className="font-medium text-foreground">Background Check</span>
                </div>
                <span className="text-xs text-success">Verified</span>
              </div>
            </div>
          </div>

          <Button onClick={handleSave} className="w-full">
            {saved ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Saved
              </>
            ) : (
              "Save Documentation"
            )}
          </Button>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-6 space-y-4">
            <h3 className="font-semibold text-foreground flex items-center gap-2 mb-4">
              <Bell className="h-5 w-5 text-primary" />
              Notification Preferences
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-border">
                <div>
                  <p className="font-medium text-foreground">Lesson Reminders</p>
                  <p className="text-sm text-muted-foreground">Reminders for upcoming lessons</p>
                </div>
                <Switch
                  checked={notifications.lessonReminders}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, lessonReminders: checked })}
                />
              </div>

              <div className="flex items-center justify-between py-3 border-b border-border">
                <div>
                  <p className="font-medium text-foreground">Payment Alerts</p>
                  <p className="text-sm text-muted-foreground">Outstanding balance and payment notifications</p>
                </div>
                <Switch
                  checked={notifications.paymentAlerts}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, paymentAlerts: checked })}
                />
              </div>

              <div className="flex items-center justify-between py-3 border-b border-border">
                <div>
                  <p className="font-medium text-foreground">New Student Requests</p>
                  <p className="text-sm text-muted-foreground">When students request to join your classes</p>
                </div>
                <Switch
                  checked={notifications.newStudentRequests}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, newStudentRequests: checked })}
                />
              </div>

              <div className="flex items-center justify-between py-3 border-b border-border">
                <div>
                  <p className="font-medium text-foreground">Review Notifications</p>
                  <p className="text-sm text-muted-foreground">When students leave reviews</p>
                </div>
                <Switch
                  checked={notifications.reviewNotifications}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, reviewNotifications: checked })}
                />
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-foreground">Marketing & Promotions</p>
                  <p className="text-sm text-muted-foreground">New features, offers, and announcements</p>
                </div>
                <Switch
                  checked={notifications.promotions}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, promotions: checked })}
                />
              </div>
            </div>

            <Button onClick={handleSave} className="w-full mt-4">
              {saved ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Saved
                </>
              ) : (
                "Save Preferences"
              )}
            </Button>
          </div>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-4">
          <div className="rounded-xl border border-border bg-card divide-y divide-border">
            <button className="flex items-center justify-between w-full px-6 py-4 hover:bg-secondary/50 transition-colors">
              <div className="flex items-center gap-3">
                <Lock className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium text-foreground">Change Password</span>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </button>
            <button className="flex items-center justify-between w-full px-6 py-4 hover:bg-secondary/50 transition-colors">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium text-foreground">Two-Factor Authentication</span>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </button>
            <button className="flex items-center justify-between w-full px-6 py-4 hover:bg-secondary/50 transition-colors">
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium text-foreground">Manage Payment Methods</span>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </button>
            <button className="flex items-center justify-between w-full px-6 py-4 hover:bg-destructive/5 transition-colors text-destructive">
              <div className="flex items-center gap-3">
                <LogOut className="h-5 w-5" />
                <span className="font-medium">Sign Out</span>
              </div>
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
