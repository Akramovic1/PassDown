"use client"

import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Mail, Wallet } from 'lucide-react'
import { usePrivy } from '@privy-io/react-auth'

export default function Profile() {
  const [profile, setProfile] = useState({
    name: '...',
    email: '...',
    wallet: '...'
  })

  const {
    ready,
    user
  } = usePrivy();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.id]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Profile updated:', profile)
    // Here you would typically send the updated profile to your backend
  }

  useEffect(() => {
    if (ready && user) {
      setProfile({
        name: '...',
        email: user.email?.address || '...',
        wallet: user.wallet?.address || '...'
      });
    }
  }, [ready, user]);


  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="mr-2 h-5 w-5" />
              Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                {/* <Label htmlFor="name" className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  Name
                </Label> */}
                {/* <Input
                  type="text"
                  id="name"
                  value={profile.name}
                  onChange={handleChange}
                /> */}
              </div>
              <div>
                <Label htmlFor="email" className="flex items-center">
                  <Mail className="mr-2 h-4 w-4" />
                  Email
                </Label>
                <Input
                  type="email"
                  id="email"
                  value={profile.email}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="wallet" className="flex items-center">
                  <Wallet className="mr-2 h-4 w-4" />
                  Connected Wallet
                </Label>
                <Input
                  type="text"
                  id="wallet"
                  value={profile.wallet}
                  readOnly
                />
              </div>
              {/* <Button type="submit" className="w-full">Update Profile</Button> */}
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}