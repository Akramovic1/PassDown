"use client"

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { FileText, Plus, Trash2 } from 'lucide-react'

const AVAILABLE_TOKENS = ['ETH', 'SHIBA', 'PEPE']

export default function CreateWill() {
  const [formData, setFormData] = useState({
    chain: '',
    distributionMethod: 'equal',
    beneficiaries: [{
      address: '',
      distribution: AVAILABLE_TOKENS.reduce((acc, token) => ({ ...acc, [token]: 100 / AVAILABLE_TOKENS.length }), {}),
      percentage: 100
    }],
    verificationMethod: 'inactivity',
    inactivityPeriod: 365, // days
    trustedWallets: [''],
    oracleAddress: '',
  })

  useEffect(() => {
    adjustPercentages()
  }, [formData.beneficiaries.length, formData.distributionMethod])

  const adjustPercentages = () => {
    const equalPercentage = 100 / formData.beneficiaries.length
    const newBeneficiaries = formData.beneficiaries.map(b => ({
      ...b,
      distribution: AVAILABLE_TOKENS.reduce((acc, token) => ({ ...acc, [token]: equalPercentage }), {}),
      percentage: equalPercentage
    }))

    setFormData(prev => ({
      ...prev,
      beneficiaries: newBeneficiaries,
    }))
  }

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
    setFormData({ ...formData, chain: value })
  }

  const handleVerificationMethodChange = (value: string) => {
    setFormData({ ...formData, verificationMethod: value })
  }

  const handleDistributionMethodChange = (value: string) => {
    setFormData({ ...formData, distributionMethod: value })
    adjustPercentages()
  }

  const handleSliderChange = (value: number[], beneficiaryIndex: number, token?: string) => {
    const newBeneficiaries: any = [...formData.beneficiaries]

    if (formData.distributionMethod === 'equal') {
      const diff = value[0] - newBeneficiaries[beneficiaryIndex].percentage
      newBeneficiaries[beneficiaryIndex].percentage = value[0]

      // Adjust other beneficiaries' percentages
      for (let i = 0; i < newBeneficiaries.length; i++) {
        if (i !== beneficiaryIndex) {
          newBeneficiaries[i].percentage = Math.max(0, newBeneficiaries[i].percentage - diff / (newBeneficiaries.length - 1))
        }
      }

      // Update distribution for all tokens
      newBeneficiaries.forEach((b: any) => {
        b.distribution = AVAILABLE_TOKENS.reduce((acc, token) => ({ ...acc, [token]: b.percentage }), {})
      })
    } else if (token) {
      const diff = value[0] - newBeneficiaries[beneficiaryIndex].distribution[token]
      newBeneficiaries[beneficiaryIndex].distribution[token] = value[0]

      // Adjust other beneficiaries' percentages for this token
      for (let i = 0; i < newBeneficiaries.length; i++) {
        if (i !== beneficiaryIndex) {
          newBeneficiaries[i].distribution[token] = Math.max(0, newBeneficiaries[i].distribution[token] - diff / (newBeneficiaries.length - 1))
        }
      }
    }

    // Ensure total is 100%
    const total = newBeneficiaries.reduce((sum: any, b: any) => sum + (formData.distributionMethod === 'equal' ? b.percentage : b.distribution[token!]), 0)
    if (total !== 100) {
      const adjustment = (100 - total) / newBeneficiaries.length
      if (formData.distributionMethod === 'equal') {
        newBeneficiaries.forEach((b: any) => {
          b.percentage += adjustment
          b.distribution = AVAILABLE_TOKENS.reduce((acc, token) => ({ ...acc, [token]: b.percentage }), {})
        })
      } else {
        newBeneficiaries.forEach((b: any) => b.distribution[token!] += adjustment)
      }
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
          percentage: 0
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
    e.preventDefault()
    console.log('Form submitted:', formData)
    // Here you would typically send the data to your backend
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
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="chain">Select Blockchain</Label>
                <Select onValueChange={handleSelectChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a blockchain" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ethereum">Ethereum</SelectItem>
                    <SelectItem value="bsc">Binance Smart Chain</SelectItem>
                    <SelectItem value="polygon">Polygon</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Distribution Method</Label>
                <RadioGroup
                  defaultValue="equal"
                  onValueChange={handleDistributionMethodChange}
                  className="flex flex-col space-y-1 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="equal" id="equal" />
                    <Label htmlFor="equal">Equal distribution for all assets</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="custom" id="custom" />
                    <Label htmlFor="custom">Specify percentages for each token</Label>
                  </div>
                </RadioGroup>
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
                    {formData.distributionMethod === 'equal' ? (
                      <div className="flex items-center space-x-2">
                        <Label className="w-16">All Assets</Label>
                        <Slider
                          className="flex-grow"
                          value={[beneficiary.percentage]}
                          onValueChange={(value) => handleSliderChange(value, index)}
                          max={100}
                          step={1}
                        />
                        <span className="w-16 text-right">{beneficiary.percentage.toFixed(2)}%</span>
                      </div>
                    ) : (
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
                    )}
                  </div>
                ))}
                <Button type="button" onClick={addBeneficiary} className="mt-2">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Beneficiary
                </Button>
              </div>

              <div>
                <Label>Death Verification Method</Label>
                <Tabs onValueChange={handleVerificationMethodChange} value={formData.verificationMethod}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="inactivity">Wallet Inactivity</TabsTrigger>
                    <TabsTrigger value="trusted">Trusted Wallets</TabsTrigger>
                    <TabsTrigger value="oracle">Oracle</TabsTrigger>
                  </TabsList>
                  <TabsContent value="inactivity">
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
                  </TabsContent>
                  <TabsContent value="trusted">
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
                  </TabsContent>
                  <TabsContent value="oracle">
                    <div className="mt-2">
                      <Label htmlFor="oracleAddress">Oracle Contract Address</Label>
                      <Input
                        type="text"
                        id="oracleAddress"
                        name="oracleAddress"
                        value={formData.oracleAddress}
                        onChange={handleChange}
                        placeholder="0x..."
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              <Button type="submit" className="w-full">Create Will</Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}