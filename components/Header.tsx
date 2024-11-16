"use client"

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Wallet2, FileText, Bell, User, FileCheck2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useLogin } from "@privy-io/react-auth";

const Header = () => {
  const pathname = usePathname()
  const router = useRouter()
  const [isConnected, setIsConnected] = useState(false)
  const { login } = useLogin({
    onComplete: () => router.push("/dashboard"),
  });

  const connectWallet = async () => {
    setIsConnected(true);
    await login();
    setIsConnected(false);
  };

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold flex items-center">
          <img src="https://i.imgur.com/zYrrMCn.png" alt="PassDown Logo" className="h-8 w-8 mr-2" />
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
                <li>
                  <Link href="/create-will" passHref>
                    <Button variant={pathname === '/create-will' ? 'default' : 'ghost'}>
                      <FileText className="mr-2 h-4 w-4" />
                      Create Will
                    </Button>
                  </Link>
                </li>
                <li>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant={pathname.startsWith('/verify') ? 'default' : 'ghost'}>
                        <FileCheck2 className="mr-2 h-4 w-4" />
                        Verify
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href="/verify/submit">Submit Verification</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/verify/status">Check Status</Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </li>
                <li>
                  <Link href="/notifications" passHref>
                    <Button variant={pathname === '/notifications' ? 'default' : 'ghost'}>
                      <Bell className="mr-2 h-4 w-4" />
                      Notifications
                    </Button>
                  </Link>
                </li>
                <li>
                  <Link href="/profile" passHref>
                    <Button variant={pathname === '/profile' ? 'default' : 'ghost'}>
                      <User className="mr-2 h-4 w-4" />
                      Profile
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