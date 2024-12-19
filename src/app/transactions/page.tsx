"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { FiEdit2, FiTrash2, FiPlus, FiFileText, FiDollarSign } from "react-icons/fi"

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

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchTransactions()
  }, [])

  const fetchTransactions = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/transactions/")
      if (!response.ok) throw new Error("Failed to fetch transactions")
      
      const data: APIResponse = await response.json()
      setTransactions(data.results || data)
    } catch (err) {
      setError("Failed to load transactions")
      console.error("Error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this transaction?")) return

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/transactions/${id}/`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete transaction")

      fetchTransactions()
    } catch (err) {
      setError("Failed to delete transaction")
      console.error("Error:", err)
    }
  }

  // Calculate total amount
  const totalAmount = transactions.reduce((sum, transaction) => {
    const amount = parseFloat(transaction.amount) || 0
    return transaction.dr_or_cr === "Dr" ? sum + amount : sum - amount
  }, 0)

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
        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* New Transaction Card */}
          <Link
            href="/transactions/new"
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-200"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 rounded-full p-3">
                <FiPlus className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">New Transaction</h2>
                <p className="text-sm text-gray-500">Create a new transaction entry</p>
              </div>
            </div>
          </Link>

          {/* Reports Card */}
          <Link
            href="/transactions/reports"
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-200"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 rounded-full p-3">
                <FiFileText className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Reports</h2>
                <p className="text-sm text-gray-500">View transaction reports</p>
              </div>
            </div>
          </Link>

          {/* Summary Card */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-purple-100 rounded-full p-3">
                <FiDollarSign className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Total Balance</h2>
                <p className="text-sm text-gray-500">
                  ₹{Math.abs(totalAmount).toLocaleString()}
                  <span className={totalAmount >= 0 ? " text-green-600" : " text-red-600"}>
                    {totalAmount >= 0 ? " (Credit)" : " (Debit)"}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-gray-900">Transactions List</h1>
              <div className="h-1 w-20 bg-blue-600 rounded-full"></div>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map((transaction) => (
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-3">
                        <Link
                          href={`/transactions/edit/${transaction.id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <FiEdit2 className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(transaction.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FiTrash2 className="h-4 w-4" />
                        </button>
                      </div>
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