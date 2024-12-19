"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface TransactionFormData {
  transaction_date: string
  business: string
  type: string
  ledger: string
  head: string
  mode: string
  amount: string
  dr_or_cr: string
  discount_amount: string
  gst: string
  description: string
}

interface Option {
  id: number
  name: string
}

interface APIResponse {
  results: Option[]
  count: number
}

export default function NewTransactionPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [businesses, setBusinesses] = useState<Option[]>([])
  const [types, setTypes] = useState<Option[]>([])
  const [ledgers, setLedgers] = useState<Option[]>([])
  const [heads, setHeads] = useState<Option[]>([])
  const [modes, setModes] = useState<Option[]>([])

  const [formData, setFormData] = useState<TransactionFormData>({
    transaction_date: new Date().toISOString().split('T')[0],
    business: "",
    type: "",
    ledger: "",
    head: "",
    mode: "",
    amount: "",
    dr_or_cr: "Dr",
    discount_amount: "0.00",
    gst: "With GST",
    description: ""
  })

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [
          businessesRes,
          typesRes,
          ledgersRes,
          headsRes,
          modesRes
        ] = await Promise.all([
          fetch("http://localhost:8000/api/businesses/"),
          fetch("http://localhost:8000/api/types/"),
          fetch("http://localhost:8000/api/ledgers/"),
          fetch("http://localhost:8000/api/heads/"),
          fetch("http://localhost:8000/api/modes/")
        ])

        const businessesData: APIResponse = await businessesRes.json()
        const typesData: APIResponse = await typesRes.json()
        const ledgersData: APIResponse = await ledgersRes.json()
        const headsData: APIResponse = await headsRes.json()
        const modesData: APIResponse = await modesRes.json()

        setBusinesses(businessesData.results || businessesData)
        setTypes(typesData.results || typesData)
        setLedgers(ledgersData.results || ledgersData)
        setHeads(headsData.results || headsData)
        setModes(modesData.results || modesData)
      } catch (err) {
        setError("Failed to load form options")
        console.error("Error fetching options:", err)
      }
    }

    fetchOptions()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("http://127.0.0.1:8000/api/transactions/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount),
          discount_amount: parseFloat(formData.discount_amount)
        }),
      })

      if (!response.ok) {
        const errorData = await response.json() 
        throw new Error(
          Object.entries(errorData)
            .map(([key, value]) => `${key}: ${value}`)
            .join(", ")
        )
      }

      router.push("/transaction")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-gray-900">Add New Transaction</h1>
            <div className="h-1 w-20 bg-blue-600 rounded-full"></div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <label htmlFor="transaction_date" className="block text-sm font-medium text-gray-700">
                  Transaction Date
                </label>
                <input
                  type="date"
                  id="transaction_date"
                  name="transaction_date"
                  required
                  value={formData.transaction_date}
                  onChange={handleChange}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="business" className="block text-sm font-medium text-gray-700">
                  Business
                </label>
                <select
                  id="business"
                  name="business"
                  required
                  value={formData.business}
                  onChange={handleChange}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Select Business</option>
                  {Array.isArray(businesses) && businesses.map((business) => (
                    <option key={business.id} value={business.id}>
                      {business.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                  Type
                </label>
                <select
                  id="type"
                  name="type"
                  required
                  value={formData.type}
                  onChange={handleChange}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Select Type</option>
                  {Array.isArray(types) && types.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="ledger" className="block text-sm font-medium text-gray-700">
                  Ledger
                </label>
                <select
                  id="ledger"
                  name="ledger"
                  required
                  value={formData.ledger}
                  onChange={handleChange}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Select Ledger</option>
                  {Array.isArray(ledgers) && ledgers.map((ledger) => (
                    <option key={ledger.id} value={ledger.id}>
                      {ledger.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="head" className="block text-sm font-medium text-gray-700">
                  Head
                </label>
                <select
                  id="head"
                  name="head"
                  required
                  value={formData.head}
                  onChange={handleChange}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Select Head</option>
                  {Array.isArray(heads) && heads.map((head) => (
                    <option key={head.id} value={head.id}>
                      {head.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                  Amount
                </label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  required
                  step="0.01"
                  value={formData.amount}
                  onChange={handleChange}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="dr_or_cr" className="block text-sm font-medium text-gray-700">
                  Debit/Credit
                </label>
                <select
                  id="dr_or_cr"
                  name="dr_or_cr"
                  required
                  value={formData.dr_or_cr}
                  onChange={handleChange}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="Dr">Debit</option>
                  <option value="Cr">Credit</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="mode" className="block text-sm font-medium text-gray-700">
                  Mode
                </label>
                <select
                  id="mode"
                  name="mode"
                  required
                  value={formData.mode}
                  onChange={handleChange}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Select Mode</option>
                  {Array.isArray(modes) && modes.map((mode) => (
                    <option key={mode.id} value={mode.id}>
                      {mode.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="discount_amount" className="block text-sm font-medium text-gray-700">
                  Discount Amount
                </label>
                <input
                  type="number"
                  id="discount_amount"
                  name="discount_amount"
                  required
                  step="0.01"
                  value={formData.discount_amount}
                  onChange={handleChange}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="gst" className="block text-sm font-medium text-gray-700">
                  GST
                </label>
                <select
                  id="gst"
                  name="gst"
                  required
                  value={formData.gst}
                  onChange={handleChange}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="With GST">With GST</option>
                  <option value="Without GST">Without GST</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex space-x-4 pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className={`flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? "Creating..." : "Create Transaction"}
              </button>
              <Link
                href="/transaction"
                className="flex-1 rounded-lg bg-gray-100 px-4 py-2.5 text-sm font-semibold text-gray-800 shadow-sm hover:bg-gray-200 text-center"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}