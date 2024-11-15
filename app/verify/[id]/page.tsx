"use client"

import { useParams } from 'next/navigation'
import Header from '@/components/Header'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText } from 'lucide-react'
import VerificationForm from '@/components/verification/VerificationForm'

export default function Verify() {
  const { id } = useParams()

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Submit Death Verification - ID: {id}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <VerificationForm userId={id as string} />
          </CardContent>
        </Card>
      </main>
    </div>
  )
}