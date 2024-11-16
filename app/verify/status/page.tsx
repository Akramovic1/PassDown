"use client"

import { useState } from 'react'
import Header from '@/components/Header'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Search, CheckCircle, XCircle, Clock } from 'lucide-react'
import { toast } from 'sonner'

interface WillStatus {
  id: string
  status: 'pending' | 'approved' | 'rejected'
  lastUpdated: string
  details: string
}

export default function CheckStatus() {
  const [willId, setWillId] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<WillStatus | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulate API call
      // await new Promise(resolve => setTimeout(resolve, 1500))

      // Simulate random status for demo
      const statuses: WillStatus['status'][] = ['pending', 'approved', 'rejected']
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)]

      setStatus({
        id: willId,
        status: randomStatus,
        lastUpdated: new Date().toLocaleDateString(),
        details: getStatusDetails(randomStatus)
      })
    } catch (error) {
      toast.error('Failed to fetch status')
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusDetails = (status: WillStatus['status']) => {
    switch (status) {
      case 'pending':
        return 'Verification is under review by the system administrators.'
      case 'approved':
        return 'Verification has been approved. The will is now active.'
      case 'rejected':
        return 'Verification was rejected. Please submit new documentation.'
      default:
        return ''
    }
  }

  const getStatusIcon = (status: WillStatus['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-16 w-16 text-yellow-500" />
      case 'approved':
        return <CheckCircle className="h-16 w-16 text-green-500" />
      case 'rejected':
        return <XCircle className="h-16 w-16 text-red-500" />
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="mr-2 h-5 w-5" />
              Check Verification Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="willId">Will ID</Label>
                <Input
                  id="willId"
                  value={willId}
                  onChange={(e) => setWillId(e.target.value)}
                  placeholder="Enter the Will ID"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Checking...' : 'Check Status'}
              </Button>
            </form>

            {status && (
              <div className="mt-8 text-center">
                <div className="flex justify-center mb-4">
                  {getStatusIcon(status.status)}
                </div>
                <h3 className="text-2xl font-semibold mb-2 capitalize">
                  Status: {status.status}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-2">
                  {status.details}
                </p>
                <p className="text-sm text-gray-500">
                  Last Updated: {status.lastUpdated}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}