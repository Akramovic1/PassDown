"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import FileUpload from './FileUpload'

interface VerificationDetails {
  id: string
  name: string
  relationship: string
  contact: string
  file: File | null
}

export default function VerificationForm({ id }: { id: string }) {
  const [details, setDetails] = useState<VerificationDetails>({
    id,
    name: '',
    relationship: '',
    contact: '',
    file: null
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!details.file) {
      toast.error('Please upload a verification document')
      return
    }

    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      toast.success('Verification submitted successfully')
      // Reset form
      setDetails({
        id,
        name: '',
        relationship: '',
        contact: '',
        file: null
      })
    } catch (error) {
      toast.error('Failed to submit verification')
    }
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            value={details.name}
            onChange={(e) => setDetails({ ...details, name: e.target.value })}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="relationship">Relationship to Deceased</Label>
          <Input
            id="relationship"
            value={details.relationship}
            onChange={(e) => setDetails({ ...details, relationship: e.target.value })}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="contact">Contact Information</Label>
          <Input
            id="contact"
            value={details.contact}
            onChange={(e) => setDetails({ ...details, contact: e.target.value })}
            required
          />
        </div>
        
        <div>
          <Label>Verification Document</Label>
          <FileUpload
            file={details.file}
            onFileSelect={(file) => setDetails({ ...details, file })}
          />
        </div>
        
        <Button type="submit" className="w-full">
          Submit Verification
        </Button>
      </form>
    </Card>
  )
}