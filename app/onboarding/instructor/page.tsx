"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, CheckCircle, FileText, Car, Shield, CreditCard, AlertCircle, Loader2 } from "lucide-react"

interface DocumentUpload {
  file: File | null
  url: string
  status: "idle" | "uploading" | "uploaded" | "error"
  error?: string
}

interface Documents {
  drivers_license: DocumentUpload
  adi_license: DocumentUpload
  enhanced_dbs: DocumentUpload
  right_to_work: DocumentUpload
  insurance_certificate: DocumentUpload
}

const documentRequirements = [
  {
    id: "drivers_license",
    label: "Driving License",
    description: "Front and back of your UK driving license",
    icon: CreditCard,
  },
  {
    id: "adi_license",
    label: "ADI License/Badge",
    description: "Your ADI certificate or badge number proof",
    icon: Shield,
  },
  {
    id: "enhanced_dbs",
    label: "Enhanced DBS Certificate",
    description: "Your Enhanced DBS check certificate",
    icon: FileText,
  },
  {
    id: "right_to_work",
    label: "Right to Work Document",
    description: "UK passport, settlement status, or work visa",
    icon: Shield,
  },
  {
    id: "insurance_certificate",
    label: "Insurance Certificate",
    description: "Valid driving instructor insurance document",
    icon: FileText,
  },
]

export default function InstructorOnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Step 1: Basic vehicle info
  const [vehicleInfo, setVehicleInfo] = useState({
    carType: "",
    numberPlate: "",
    adiLicenseNumber: "",
    phone: "",
  })

  // Step 2: Document uploads
  const [documents, setDocuments] = useState<Documents>({
    drivers_license: { file: null, url: "", status: "idle" },
    adi_license: { file: null, url: "", status: "idle" },
    enhanced_dbs: { file: null, url: "", status: "idle" },
    right_to_work: { file: null, url: "", status: "idle" },
    insurance_certificate: { file: null, url: "", status: "idle" },
  })

  function handleVehicleChange(name: string, value: string) {
    setVehicleInfo((prev) => ({ ...prev, [name]: value }))
  }

  async function handleFileUpload(documentType: keyof Documents, file: File) {
    setDocuments((prev) => ({
      ...prev,
      [documentType]: { ...prev[documentType], file, status: "uploading" },
    }))

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("documentType", documentType)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Upload failed")
      }

      const data = await response.json()

      setDocuments((prev) => ({
        ...prev,
        [documentType]: { file, url: data.url, status: "uploaded" },
      }))
    } catch (err) {
      setDocuments((prev) => ({
        ...prev,
        [documentType]: {
          ...prev[documentType],
          status: "error",
          error: err instanceof Error ? err.message : "Upload failed",
        },
      }))
    }
  }

  function handleFileChange(documentType: keyof Documents, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      handleFileUpload(documentType, file)
    }
  }

  async function handleSubmit() {
    setLoading(true)
    setError("")

    try {
      // Check all documents are uploaded
      const allUploaded = Object.values(documents).every((doc) => doc.status === "uploaded")
      if (!allUploaded) {
        setError("Please upload all required documents")
        setLoading(false)
        return
      }

      // Submit documents and vehicle info to API
      const response = await fetch("/api/instructor/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vehicleInfo,
          documents: Object.entries(documents).map(([type, doc]) => ({
            document_type: type,
            file_url: doc.url,
            file_name: doc.file?.name || "",
            file_size: doc.file?.size || 0,
          })),
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Submission failed")
      }

      // Redirect to pending approval page
      router.push("/onboarding/instructor/pending")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const allDocumentsUploaded = Object.values(documents).every((doc) => doc.status === "uploaded")
  const vehicleInfoComplete =
    vehicleInfo.carType && vehicleInfo.numberPlate && vehicleInfo.adiLicenseNumber && vehicleInfo.phone

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Complete Your Profile</CardTitle>
          <CardDescription>
            {step === 1
              ? "Step 1 of 2: Enter your vehicle and license details"
              : "Step 2 of 2: Upload required documents for verification"}
          </CardDescription>
          {/* Progress indicator */}
          <div className="flex gap-2 mt-4">
            <div className={`h-2 flex-1 rounded ${step >= 1 ? "bg-primary" : "bg-muted"}`} />
            <div className={`h-2 flex-1 rounded ${step >= 2 ? "bg-primary" : "bg-muted"}`} />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded text-destructive text-sm flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          {step === 1 && (
            <>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+44 7123 456789"
                    value={vehicleInfo.phone}
                    onChange={(e) => handleVehicleChange("phone", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="adiLicenseNumber">ADI License Number</Label>
                  <Input
                    id="adiLicenseNumber"
                    placeholder="Enter your ADI license number"
                    value={vehicleInfo.adiLicenseNumber}
                    onChange={(e) => handleVehicleChange("adiLicenseNumber", e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Your Approved Driving Instructor license number</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="carType">Vehicle Type</Label>
                  <Select value={vehicleInfo.carType} onValueChange={(value) => handleVehicleChange("carType", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select transmission type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manual">Manual</SelectItem>
                      <SelectItem value="automatic">Automatic</SelectItem>
                      <SelectItem value="both">Both (Multiple Vehicles)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="numberPlate">Vehicle Number Plate</Label>
                  <Input
                    id="numberPlate"
                    placeholder="AB12 CDE"
                    value={vehicleInfo.numberPlate}
                    onChange={(e) => handleVehicleChange("numberPlate", e.target.value.toUpperCase())}
                  />
                </div>
              </div>

              <Button onClick={() => setStep(2)} className="w-full" disabled={!vehicleInfoComplete}>
                <Car className="mr-2 h-4 w-4" />
                Continue to Document Upload
              </Button>
            </>
          )}

          {step === 2 && (
            <>
              <div className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg border">
                  <h3 className="font-medium flex items-center gap-2">
                    <Shield className="h-4 w-4 text-primary" />
                    Document Requirements
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Upload clear photos or scanned copies of the following documents. All documents will be reviewed by
                    our team before your account is activated.
                  </p>
                </div>

                {documentRequirements.map((doc) => {
                  const docState = documents[doc.id as keyof Documents]
                  const Icon = doc.icon

                  return (
                    <div key={doc.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-muted rounded">
                            <Icon className="h-4 w-4" />
                          </div>
                          <div>
                            <h4 className="font-medium">{doc.label}</h4>
                            <p className="text-sm text-muted-foreground">{doc.description}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {docState.status === "uploaded" && <CheckCircle className="h-5 w-5 text-green-500" />}
                          {docState.status === "uploading" && <Loader2 className="h-5 w-5 animate-spin text-primary" />}
                          {docState.status === "error" && <AlertCircle className="h-5 w-5 text-destructive" />}
                        </div>
                      </div>

                      {docState.status === "error" && docState.error && (
                        <p className="text-sm text-destructive mt-2">{docState.error}</p>
                      )}

                      {docState.status === "uploaded" && docState.file && (
                        <p className="text-sm text-muted-foreground mt-2">Uploaded: {docState.file.name}</p>
                      )}

                      <div className="mt-3">
                        <Label htmlFor={doc.id} className="cursor-pointer">
                          <div className="border-2 border-dashed rounded-lg p-4 text-center hover:bg-muted/50 transition-colors">
                            <Upload className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">
                              {docState.status === "uploaded"
                                ? "Click to replace file"
                                : "Click to upload or drag and drop"}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">PDF, JPG, PNG up to 10MB</p>
                          </div>
                          <Input
                            id={doc.id}
                            type="file"
                            className="hidden"
                            accept=".pdf,.jpg,.jpeg,.png,.webp"
                            onChange={(e) => handleFileChange(doc.id as keyof Documents, e)}
                            disabled={docState.status === "uploading"}
                          />
                        </Label>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                  Back
                </Button>
                <Button onClick={handleSubmit} className="flex-1" disabled={!allDocumentsUploaded || loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit for Review"
                  )}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
