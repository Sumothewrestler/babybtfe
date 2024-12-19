"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi"

interface Mode {
  id: number
  name: string
}

interface APIResponse {
  results: Mode[]
  count: number
}

export default function ModeViewPage() {
  const router = useRouter()
  const [modes, setModes] = useState<Mode[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  useEffect(() => {
    fetchModes()
  }, [])

  const fetchModes = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/modes/")
      if (!response.ok) throw new Error("Failed to fetch modes")
      const data: APIResponse = await response.json()
      const modesList = Array.isArray(data) ? data : data.results || []
      setModes(modesList)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load modes")
      setModes([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this mode?")) return

    setDeleteId(id)
    try {
      const response = await fetch(`http://localhost:8000/api/modes/${id}/`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete mode")
      
      setModes(modes.filter(mode => mode.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete mode")
    } finally {
      setDeleteId(null)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading modes...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Modes List</h1>
            <div className="h-1 w-20 bg-blue-600 mt-2 rounded-full"></div>
          </div>
          <Link
            href="/mode/new"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
          >
            <FiPlus className="mr-2" />
            Add New Mode
          </Link>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg">
            {error}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mode Name
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {modes.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                      No modes found
                    </td>
                  </tr>
                ) : (
                  modes.map((mode) => (
                    <tr key={mode.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {mode.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {mode.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-3">
                          <button
                            onClick={() => router.push(`/mode/edit/${mode.id}`)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <FiEdit2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(mode.id)}
                            disabled={deleteId === mode.id}
                            className={`text-red-600 hover:text-red-900 ${
                              deleteId === mode.id ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                          >
                            <FiTrash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}