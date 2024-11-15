"use client"

import { useState } from 'react'
import Header from '@/components/Header'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell } from 'lucide-react'

export default function Notifications() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Will Activation Alert',
      message: 'Your will on Ethereum network is approaching its activation date.',
      time: '2 days ago'
    },
    {
      id: 2,
      title: 'New Feature Available',
      message: 'Multi-chain support is now available for all users.',
      time: '1 week ago'
    },
    {
      id: 3,
      title: 'Security Update',
      message: "We've enhanced our security measures. Please review your account settings.",
      time: '2 weeks ago'
    },
    {
      id: 4,
      title: 'Asset Transfer Completed',
      message: 'Your recent asset transfer on Binance Smart Chain has been successfully completed.',
      time: '3 days ago'
    },
    {
      id: 5,
      title: 'Will Modification Required',
      message: 'Due to recent changes in regulations, your will on Polygon network needs to be updated.',
      time: '5 days ago'
    },
    {
      id: 6,
      title: 'New Blockchain Support',
      message: 'We now support creating wills on the Solana blockchain. Explore new options in your dashboard.',
      time: '1 month ago'
    }
  ])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="mr-2 h-5 w-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            {notifications.map((notification) => (
              <div key={notification.id} className="mb-4 p-4 border rounded-lg">
                <h3 className="font-semibold">{notification.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{notification.message}</p>
                <span className="text-xs text-gray-500 mt-2 block">{notification.time}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}