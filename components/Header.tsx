"use client"

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Wallet2, FileText, Bell, User, FileCheck2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const Header = () => {
  const pathname = usePathname()
  const [isConnected, setIsConnected] = useState(false)

  const connectWallet = async () => {
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsConnected(true)
  }

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold">
          PassDown
        </Link>
        <nav>
          <ul className="flex space-x-4">
            {isConnected ? (
              <>
                <li>
                  <Link href="/dashboard" passHref>
                    <Button variant={pathname === '/dashboard' ? 'default' : 'ghost'}>
                      <Wallet2 className="mr-2 h-4 w-4" />
                      Dashboard
                    </Button>
                  </Link>
                </li>
              </>
            ) : (
              <li>
                <Button onClick={connectWallet}>
                  <Wallet2 className="mr-2 h-4 w-4" />
                  Connect Wallet
                </Button>
              </li>
            )}
          </ul>
        </nav>
        <ModeToggle />
      </div>
    </header>
  )
}

export default Header