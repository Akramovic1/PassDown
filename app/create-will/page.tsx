"use client"

import { useState } from 'react'
import Header from '@/components/Header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { FileText, Plus, Trash2 } from 'lucide-react'
import { CHAIN_IDS, ERC20_ABI, PASSDOWN_ABI, PASSDOWN_ADDRESS } from '../constants'
import { encodeFunctionData } from 'viem'
import { usePrivy } from '@privy-io/react-auth'

const AVAILABLE_TOKENS = ['USDC']
const TOKEN_ADDRESS = {
  USDC: '0x52Bf57b19c37Bd2A92b54018aE18AA4D651a6a43',
}

type Distribution = {
  [key: string]: number;
};

export default function CreateWill() {
  const { sendTransaction, user } = usePrivy();
  const [formData, setFormData] = useState({
    chain: 'baseSepolia' as keyof typeof CHAIN_IDS,
    beneficiaries: [{
      address: '',
      distribution: AVAILABLE_TOKENS.reduce((acc, token) => ({ ...acc, [token]: 100 / AVAILABLE_TOKENS.length }), {}) as Distribution,
    }],
    inactivityPeriod: 365, // days
    trustedWallets: [''],
  })
  const [isApproved, setIsApproved] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index?: number) => {
    if (index !== undefined && e.target.name === 'beneficiaries.address') {
      const newBeneficiaries = [...formData.beneficiaries]
      newBeneficiaries[index] = { ...newBeneficiaries[index], address: e.target.value }
      setFormData({ ...formData, beneficiaries: newBeneficiaries })
    } else if (e.target.name === 'trustedWallets') {
      const newTrustedWallets = [...formData.trustedWallets]
      newTrustedWallets[index!] = e.target.value
      setFormData({ ...formData, trustedWallets: newTrustedWallets })
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value })
    }
  }

  const handleSelectChange = (value: string) => {
    setFormData({ ...formData, chain: value as keyof typeof CHAIN_IDS })
  }

  const handleSliderChange = (value: number[], beneficiaryIndex: number, token: string) => {
    const newBeneficiaries: any = [...formData.beneficiaries]
    const diff = value[0] - newBeneficiaries[beneficiaryIndex].distribution[token]
    newBeneficiaries[beneficiaryIndex].distribution[token] = value[0]

    // Adjust other beneficiaries' percentages for this token
    for (let i = 0; i < newBeneficiaries.length; i++) {
      if (i !== beneficiaryIndex) {
        newBeneficiaries[i].distribution[token] = Math.max(0, newBeneficiaries[i].distribution[token] - diff / (newBeneficiaries.length - 1))
      }
    }

    // Ensure total is 100%
    const total = newBeneficiaries.reduce((sum: any, b: any) => sum + b.distribution[token], 0)
    if (total !== 100) {
      const adjustment = (100 - total) / newBeneficiaries.length
      newBeneficiaries.forEach((b: any) => b.distribution[token] += adjustment)
    }

    setFormData({ ...formData, beneficiaries: newBeneficiaries })
  }

  const addBeneficiary = () => {
    setFormData(prev => ({
      ...prev,
      beneficiaries: [
        ...prev.beneficiaries,
        {
          address: '',
          distribution: AVAILABLE_TOKENS.reduce((acc, token) => ({ ...acc, [token]: 0 }), {}),
        }
      ]
    }))
  }

  const removeBeneficiary = (index: number) => {
    setFormData(prev => ({
      ...prev,
      beneficiaries: prev.beneficiaries.filter((_, i) => i !== index)
    }))
  }

  const addTrustedWallet = () => {
    setFormData(prev => ({
      ...prev,
      trustedWallets: [...prev.trustedWallets, '']
    }))
  }

  const removeTrustedWallet = (index: number) => {
    setFormData(prev => ({
      ...prev,
      trustedWallets: prev.trustedWallets.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const chainId = CHAIN_IDS[formData.chain];
    console.log('Chain ID:', chainId);

    const inactivityTime = formData.inactivityPeriod * 24 * 60 * 60;
    console.log('Inactivity Time (seconds):', inactivityTime);

    const trustedWallets = formData.trustedWallets;
    console.log('Trusted Wallets:', trustedWallets);

    const tokenDetails = AVAILABLE_TOKENS.map(token => ({
      tokenAddress: TOKEN_ADDRESS[token as keyof typeof TOKEN_ADDRESS],
      beneficiaries: formData.beneficiaries.map(beneficiary => ({
        beneficiaryAddress: beneficiary.address,
        percentage: Number(beneficiary!.distribution[token]) * 100
      }))
    }));
    console.log('Token Details:', tokenDetails);

    const calldata = encodeFunctionData({
      abi: PASSDOWN_ABI,
      functionName: "createWill",
      args: [tokenDetails, trustedWallets, inactivityTime],
    })

    const willTx = sendTransaction(
      {
        to: PASSDOWN_ADDRESS[formData.chain],
        value: "0x0",
        data: calldata,
        chainId: chainId,
        gasLimit: BigInt("1000000"),
        gasPrice: BigInt("100000000000"),
      },
      {
        showWalletUIs: true,
        title: "Create Will",
      }
    );
    // Here you would typically send the data to your backend
  }

  const approveToken = () => {
    const chainId = CHAIN_IDS[formData.chain];
    const tokenDetails = AVAILABLE_TOKENS.map(token => ({
      tokenAddress: TOKEN_ADDRESS[token as keyof typeof TOKEN_ADDRESS],
      beneficiaries: formData.beneficiaries.map(beneficiary => ({
        beneficiaryAddress: beneficiary.address,
        percentage: Number(beneficiary!.distribution[token]) * 100
      }))
    }));
    for (let token of tokenDetails) {
      // make approve for contract
      const approveCalldata = encodeFunctionData({
        abi: ERC20_ABI,
        functionName: "approve",
        args: [PASSDOWN_ADDRESS[formData.chain], "100000000000000"]
      });

      const approveTx = sendTransaction(
        {
          to: token.tokenAddress,
          value: "0x0",
          data: approveCalldata,
          chainId: chainId,
          gasLimit: BigInt("1000000"),
          gasPrice: BigInt("100000000000"),
        },
        {
          showWalletUIs: true,
          title: "Approve Token",
        }
      );
    }
    setIsApproved(true);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Create New Will
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              <div>
                <Label htmlFor="chain">Select Blockchain</Label>
                <Select onValueChange={handleSelectChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a blockchain" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="baseSepolia">Base</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Beneficiaries</Label>
                {formData.beneficiaries.map((beneficiary: any, index) => (
                  <div key={index} className="mt-4 p-4 border rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Input
                        type="text"
                        name="beneficiaries.address"
                        placeholder="Beneficiary Address"
                        value={beneficiary.address}
                        onChange={(e) => handleChange(e, index)}
                      />
                      {index > 0 && (
                        <Button type="button" variant="destructive" size="icon" onClick={() => removeBeneficiary(index)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <div className="space-y-2">
                      {AVAILABLE_TOKENS.map(token => (
                        <div key={token} className="flex items-center space-x-2">
                          <Label className="w-16">{token}</Label>
                          <Slider
                            className="flex-grow"
                            value={[beneficiary.distribution[token]]}
                            onValueChange={(value) => handleSliderChange(value, index, token)}
                            max={100}
                            step={1}
                          />
                          <span className="w-16 text-right">{beneficiary.distribution[token].toFixed(2)}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                <Button type="button" onClick={addBeneficiary} className="mt-2">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Beneficiary
                </Button>
              </div>

              <div>
                <Label>Death Verification</Label>
                <div className="mt-2">
                  <Label htmlFor="inactivityPeriod">Inactivity Period (days)</Label>
                  <Input
                    type="number"
                    id="inactivityPeriod"
                    name="inactivityPeriod"
                    value={formData.inactivityPeriod}
                    onChange={handleChange}
                    min={1}
                  />
                </div>
                <div className="mt-2">
                  <Label>Trusted Wallets</Label>
                  {formData.trustedWallets.map((wallet, index) => (
                    <div key={index} className="flex items-center space-x-2 mt-2">
                      <Input
                        type="text"
                        name="trustedWallets"
                        placeholder="Trusted Wallet Address"
                        value={wallet}
                        onChange={(e) => handleChange(e, index)}
                      />
                      {index > 0 && (
                        <Button type="button" variant="destructive" size="icon" onClick={() => removeTrustedWallet(index)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button type="button" onClick={addTrustedWallet} className="mt-2">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Trusted Wallet
                  </Button>
                </div>
                <div className="mt-2">
                  <p>We will also use oracles to verify death with government records.</p>
                </div>
              </div>

              {!isApproved && (
                <Button type="button" onClick={approveToken} className="w-full">Approve</Button>
              )}
              {isApproved && (
                <Button type="button" onClick={handleSubmit} className="w-full">Create Will</Button>
              )}
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}