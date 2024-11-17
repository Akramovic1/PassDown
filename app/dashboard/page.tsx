"use client"

import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Wallet, FileText, AlertTriangle, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { usePrivy } from "@privy-io/react-auth";
import { getUserWills } from '../getter'

type Will = {
  id?: number
  isActive: boolean;
  isCanceled: boolean;
  maxInactivity: number;
  trustedWallet: string[];
  tokens: {
    tokenAddress: string;
    beneficiaries: string[];
  }[];
};

export default function Dashboard() {
  const { signMessage, sendTransaction, user, ready } = usePrivy();
  const [activeWills, setActiveWills] = useState<Will[]>([

  ])

  const [assets, setAssets] = useState([
    { chain: 'Ethereum', balance: '10 ETH' },
    { chain: 'Binance Smart Chain', balance: '500 BNB' },
    { chain: 'Polygon', balance: '1000 MATIC' },
  ])

  const getWills = async () => {
    debugger;
    const address = user?.wallet?.address;
    if (address) {
      const wills = await getUserWills(address) as any;
      const res = wills.map((wills: any) => {
        // will[1].id = will[0];
        // return will[1];
        let will;
        for (let i = 0; i < wills.length; i++) {
          will = wills[i][1];
          // will.id = wills[i][0].toString();
        }
        console.log(will);
        return will;
      });
      console.log(res);
      setActiveWills(res as Will[]);
    } else {
      console.error("User wallet address is undefined");
    }
  }

  useEffect(() => {
    getWills();
  }, [ready])

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
              {activeWills.map((will, index) => (
                <div key={index} className="mb-4 p-4 border rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">Is Active: {will.isActive ? 'Yes' : 'No'}</span>
                    <span className="text-sm text-gray-500">Is Canceled: {will.isCanceled ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="text-sm mb-2">Max Inactivity: {will.maxInactivity}</div>
                  <div className="text-sm mb-2">Trusted Wallets: {will.trustedWallet}</div>
                  <div className="text-sm">Tokens:</div>
                  {will.tokens.map((token, tokenIndex) => (
                    <div key={tokenIndex} className="ml-4">
                      <div>Token Address: {token.tokenAddress}</div>
                      <div>Beneficiaries: {token.beneficiaries.join(', ')}</div>
                    </div>
                  ))}
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