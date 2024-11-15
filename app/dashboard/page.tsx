"use client"

import { useState } from 'react'
import Header from '@/components/Header'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Wallet, FileText, AlertTriangle, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default function Dashboard() {
  const [activeWills, setActiveWills] = useState([
    { id: 1, chain: 'Ethereum', amount: '5 ETH', beneficiary: '0x1234...5678' },
    { id: 2, chain: 'Binance Smart Chain', amount: '100 BNB', beneficiary: '0xabcd...efgh' },
  ])

  const [assets, setAssets] = useState([
    { chain: 'Ethereum', balance: '10 ETH' },
    { chain: 'Binance Smart Chain', balance: '500 BNB' },
    { chain: 'Polygon', balance: '1000 MATIC' },
  ])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Link href="/create-will">
            <Button>
              <FileText className="mr-2 h-4 w-4" />
              Create New Will
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Active Wills
              </CardTitle>
            </CardHeader>
            <CardContent>
              {activeWills.map((will) => (
                <div key={will.id} className="mb-4 p-4 border rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">{will.chain}</span>
                    <span className="text-sm text-gray-500">{will.amount}</span>
                  </div>
                  <div className="text-sm">Beneficiary: {will.beneficiary}</div>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Wallet className="mr-2 h-5 w-5" />
                Asset Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              {assets.map((asset, index) => (
                <div key={index} className="mb-4 p-4 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">{asset.chain}</span>
                    <span>{asset.balance}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}