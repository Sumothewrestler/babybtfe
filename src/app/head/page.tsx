"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi"

interface Head {
  id: number
  name: string
}

interface APIResponse {
  results: Head[]
  count: number
}

export default function HeadViewPage() {
  const router = useRouter()
  const [heads, setHeads] = useState<Head[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  useEffect(() => {
    fetchHeads()
  }, [])

  const fetchHeads = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/heads/")
      if (!response.ok) throw new Error("Failed to fetch heads")
      const data: APIResponse = await response.json()
      const headsList = Array.isArray(data) ? data : data.results || []
      setHeads(headsList)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load heads")
      setHeads([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this head?")) return

    setDeleteId(id)
    try {
      const response = await fetch(`http://localhost:8000/api/heads/${id}/`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete head")
      
      setHeads(heads.filter(head => head.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete head")
    } finally {
      setDeleteId(null)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading heads...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Heads List</h1>
            <div className="h-1 w-20 bg-blue-600 mt-2 rounded-full"></div>
          </div>
          <Link
            href="/head/new"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
          >
            <FiPlus className="mr-2" />
            Add New Head
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
                    Head Name
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {heads.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                      No heads found
                    </td>
                  </tr>
                ) : (
                  heads.map((head) => (
                    <tr key={head.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {head.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {head.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-3">
                          <button
                            onClick={() => router.push(`/head/edit/${head.id}`)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <FiEdit2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(head.id)}
                            disabled={deleteId === head.id}
                            className={`text-red-600 hover:text-red-900 ${
                              deleteId === head.id ? "opacity-50 cursor-not-allowed" : ""
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