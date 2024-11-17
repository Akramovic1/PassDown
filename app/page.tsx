"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import { Button } from '@/components/ui/button'
import {
  Wallet,
  Users,
  Clock,
  FileCheck2,
  Bell,
  Network,
  Lock,
  CheckCircle2
} from 'lucide-react'
import { useLogin, usePrivy } from "@privy-io/react-auth";
// import { PrivyClient } from "@privy-io/server-auth";

export default function Home() {
  const [isConnecting, setIsConnecting] = useState(false)
  const router = useRouter()
  const { login } = useLogin({
    // onComplete: () => router.push("/dashboard"),
  });

  const {
    ready,
    authenticated
  } = usePrivy();

  const connectWallet = async () => {
    setIsConnecting(true);
    await login();
    setIsConnecting(false);
  };

  const features = [
    {
      icon: <Lock className="h-12 w-12 mb-4 text-blue-600" />,
      title: "Secure Will Creation",
      description: "Create and manage crypto wills with military-grade encryption and multi-signature security protocols."
    },
    {
      icon: <Clock className="h-12 w-12 mb-4 text-blue-600" />,
      title: "Inactivity Monitoring",
      description: "Set custom inactivity periods that automatically trigger will execution when exceeded."
    },
    {
      icon: <Users className="h-12 w-12 mb-4 text-blue-600" />,
      title: "Trusted Verifiers",
      description: "Designate trusted wallets to verify and confirm death status for added security."
    },
    {
      icon: <FileCheck2 className="h-12 w-12 mb-4 text-blue-600" />,
      title: "Oracle Integration",
      description: "Automated verification through death certificate oracles for seamless will activation."
    },
    {
      icon: <Network className="h-12 w-12 mb-4 text-blue-600" />,
      title: "Multi-Chain Support",
      description: "Create wills across multiple blockchain networks including Ethereum, BSC, and Polygon."
    },
    {
      icon: <Bell className="h-12 w-12 mb-4 text-blue-600" />,
      title: "Smart Notifications",
      description: "Receive timely alerts about will status, verification requests, and important updates."
    }
  ]

  const testimonials = [
    {
      quote: "This platform gave me peace of mind knowing my crypto assets will be safely transferred to my family.",
      author: "Michael R.",
      role: "Crypto Investor",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100&h=100"
    },
    {
      quote: "The multi-chain support and automated verification system made setting up my crypto will incredibly easy.",
      author: "Sarah L.",
      role: "DeFi Developer",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100"
    },
    {
      quote: "The trusted verifier system provides an extra layer of security that other platforms don't offer.",
      author: "David K.",
      role: "Blockchain Consultant",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100&h=100"
    }
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600">
        <div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80")',
            opacity: 0.2
          }}
        />
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">Secure Your Crypto Legacy</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">Connect your wallet to create and manage wills for your crypto assets across multiple blockchain networks.</p>
          <Button
            onClick={connectWallet}
            disabled={isConnecting}
            size="lg"
            className="bg-white text-blue-600 hover:bg-gray-100"
          >
            {authenticated ? (
              <>
                <Wallet className="mr-2 h-5 w-5" />
                <>Connected</>
              </>
            ) : (
              <>
                <Wallet className="mr-2 h-5 w-5" />
                Connect Wallet
              </>
            )}
          </Button>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Platform Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg transform transition-transform hover:scale-105">
                <div className="flex justify-center">{feature.icon}</div>
                <h3 className="text-2xl font-semibold mb-4 text-center">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-center">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: <Wallet className="h-12 w-12 text-blue-600" />, title: "Connect Wallet", desc: "Link your crypto wallets to our platform" },
              { icon: <Users className="h-12 w-12 text-blue-600" />, title: "Set Beneficiaries", desc: "Add wallet addresses of your beneficiaries" },
              { icon: <Clock className="h-12 w-12 text-blue-600" />, title: "Configure Triggers", desc: "Set inactivity period and verification methods" },
              { icon: <CheckCircle2 className="h-12 w-12 text-blue-600" />, title: "Automatic Transfer", desc: "Assets transfer when conditions are met" }
            ].map((step, i) => (
              <div key={i} className="text-center bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
                <div className="flex justify-center mb-4">{step.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">What Our Users Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
                <div className="flex items-center mb-6">
                  <img
                    src={testimonial.image}
                    alt={testimonial.author}
                    className="w-16 h-16 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-semibold">{testimonial.author}</h4>
                    <p className="text-gray-600 dark:text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 italic">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners Section */}
      {/* <section className="py-20 overflow-hidden">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Our Partners</h2>
          <div className="relative">
            <div className="flex space-x-8 animate-marquee">
              {[...partners, ...partners].map((partner, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center justify-center w-32 h-32 rounded-full bg-white dark:bg-gray-800 shadow-lg transform transition-transform hover:scale-110"
                >
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="w-16 h-16 object-contain mb-2"
                  />
                  <span className="text-sm font-medium text-center">{partner.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section> */}

      {/* Supported Blockchains Section */}
      {/* <section className="py-20 bg-gray-50 dark:bg-gray-900 overflow-hidden">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Supported Blockchains</h2>
          <div className="relative">
            <div className="flex space-x-8 animate-marquee-reverse">
              {[...blockchains, ...blockchains].map((blockchain, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center justify-center w-32 h-32 rounded-full bg-white dark:bg-gray-800 shadow-lg transform transition-transform hover:scale-110"
                >
                  <img
                    src={blockchain.logo}
                    alt={blockchain.name}
                    className="w-16 h-16 object-contain mb-2"
                  />
                  <span className="text-sm font-medium text-center">{blockchain.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section> */}

      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">PassDown</h3>
              <p className="text-gray-400">Securing your digital legacy for the next generation.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="/dashboard" className="text-gray-400 hover:text-white">Dashboard</a></li>
                <li><a href="/create-will" className="text-gray-400 hover:text-white">Create Will</a></li>
                <li><a href="/profile" className="text-gray-400 hover:text-white">Profile</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">FAQs</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Compliance</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 PassDown Application. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}