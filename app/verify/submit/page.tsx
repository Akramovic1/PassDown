"use client"

import { useState } from 'react'
import Header from '@/components/Header'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { FileText, Upload } from 'lucide-react'
import { toast } from 'sonner'
import FileUpload from '@/components/verification/FileUpload'

interface SubmissionForm {
  name: string
  email: string
  relationship: string
  userId: string
  willId: string
  file: File | null
}

export default function SubmitVerification() {
  const [form, setForm] = useState<SubmissionForm>({
    name: '',
    email: '',
    relationship: '',
    userId: '',
    willId: '',
    file: null
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      toast.success('Verification submitted successfully')
      setForm({
        name: '',
        email: '',
        relationship: '',
        userId: '',
        willId: '',
        file: null
      })
    } catch (error) {
      toast.error('Failed to submit verification')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Submit Death Verification
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="userId">User ID</Label>
                  <Input
                    id="userId"
                    value={form.userId}
                    onChange={(e) => setForm({ ...form, userId: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="willId">Will ID</Label>
                  <Input
                    id="willId"
                    value={form.willId}
                    onChange={(e) => setForm({ ...form, willId: e.target.value })}
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="relationship">Relationship to Deceased</Label>
                  <Input
                    id="relationship"
                    value={form.relationship}
                    onChange={(e) => setForm({ ...form, relationship: e.target.value })}
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <Label>Verification Document</Label>
                  <FileUpload
                    file={form.file}
                    onFileSelect={(file) => setForm({ ...form, file })}
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>Submitting...</>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Submit Verification
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}