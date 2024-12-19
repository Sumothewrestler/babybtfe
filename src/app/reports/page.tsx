"use client"

import { useState, useEffect, useMemo, useCallback } from "react"

interface Transaction {
  id: number
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
  description: string | null
}

interface APIResponse {
  count: number
  next: string | null
  previous: string | null
  results: Transaction[]
}

interface FilterOptions {
  business: string[]
  type: string[]
  ledger: string[]
  head: string[]
  mode: string[]
}

export default function ReportsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<Partial<Record<keyof FilterOptions, string>>>({})
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    business: [],
    type: [],
    ledger: [],
    head: [],
    mode: [],
  })

  const fetchTransactions = useCallback(async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/transactions/")
      if (!response.ok) throw new Error("Failed to fetch transactions")
      
      const data: APIResponse = await response.json()
      setTransactions(data.results || [])
      updateFilterOptions(data.results || [])
    } catch (err) {
      setError("Failed to load transactions")
      console.error("Error:", err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  const updateFilterOptions = (transactions: Transaction[]) => {
    const options: FilterOptions = {
      business: [],
      type: [],
      ledger: [],
      head: [],
      mode: [],
    }

    transactions.forEach((transaction) => {
      options.business.push(transaction.business)
      options.type.push(transaction.type)
      options.ledger.push(transaction.ledger)
      options.head.push(transaction.head)
      options.mode.push(transaction.mode)
    })

    for (const key in options) {
      options[key as keyof FilterOptions] = Array.from(new Set(options[key as keyof FilterOptions]))
    }

    setFilterOptions(options)
  }

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      return Object.entries(filters).every(([key, value]) => {
        return value === '' || transaction[key as keyof Transaction] === value
      })
    })
  }, [transactions, filters])

  const { totalCredit, totalDebit } = useMemo(() => {
    return filteredTransactions.reduce(
      (acc, transaction) => {
        const amount = parseFloat(transaction.amount) || 0
        if (transaction.dr_or_cr === "Dr") {
          acc.totalDebit += amount
        } else {
          acc.totalCredit += amount
        }
        return acc
      },
      { totalCredit: 0, totalDebit: 0 }
    )
  }, [filteredTransactions])

  const netBalanceType = totalCredit >= totalDebit ? "Credit" : "Debit"
  const netBalanceAmount = Math.abs(totalCredit - totalDebit)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Loading transactions...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-gray-900">Transaction Reports</h1>
              <div className="h-1 w-20 bg-blue-600 rounded-full"></div>
            </div>
            <div className="flex space-x-4">
              <div className="p-4 rounded-lg bg-gradient-to-r from-green-400 to-green-600 text-white shadow-lg">
                <div className="text-sm font-medium">Total Credit</div>
                <div className="text-2xl font-bold">₹{totalCredit.toLocaleString()}</div>
              </div>
              <div className="p-4 rounded-lg bg-gradient-to-r from-red-400 to-red-600 text-white shadow-lg">
                <div className="text-sm font-medium">Total Debit</div>
                <div className="text-2xl font-bold">₹{totalDebit.toLocaleString()}</div>
              </div>
              <div className={`p-4 rounded-lg text-white shadow-lg ${
                netBalanceType === "Credit" 
                  ? "bg-gradient-to-r from-green-400 to-green-600" 
                  : "bg-gradient-to-r from-red-400 to-red-600"
              }`}>
                <div className="text-sm font-medium">Net Balance</div>
                <div className="text-2xl font-bold">
                  ₹{netBalanceAmount.toLocaleString()} ({netBalanceType})
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {(Object.keys(filterOptions) as Array<keyof FilterOptions>).map((key) => (
              <div key={key} className="flex flex-col">
                <label htmlFor={key} className="text-sm font-medium text-gray-700 mb-1">
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </label>
                <select
                  id={key}
                  value={filters[key] || ''}
                  onChange={(e) => setFilters({ ...filters, [key]: e.target.value })}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="">All</option>
                  {filterOptions[key].map((option: string) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Business
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ledger
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Head
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mode
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dr/Cr
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    GST
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(transaction.transaction_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.business}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.ledger}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.head}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.mode}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{parseFloat(transaction.amount).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.dr_or_cr}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.gst}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

