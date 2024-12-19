"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi"

interface Type {
  id: number
  name: string
}

interface APIResponse {
  results: Type[]
  count: number
}

export default function TypeViewPage() {
  const router = useRouter()
  const [types, setTypes] = useState<Type[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  useEffect(() => {
    fetchTypes()
  }, [])

  const fetchTypes = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/types/")
      if (!response.ok) throw new Error("Failed to fetch types")
      const data: APIResponse = await response.json()
      const typesList = Array.isArray(data) ? data : data.results || []
      setTypes(typesList)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load types")
      setTypes([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this type?")) return

    setDeleteId(id)
    try {
      const response = await fetch(`http://localhost:8000/api/types/${id}/`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete type")
      
      setTypes(types.filter(type => type.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete type")
    } finally {
      setDeleteId(null)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading types...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Types List</h1>
            <div className="h-1 w-20 bg-blue-600 mt-2 rounded-full"></div>
          </div>
          <Link
            href="/type/new"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
          >
            <FiPlus className="mr-2" />
            Add New Type
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
                    Type Name
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {types.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                      No types found
                    </td>
                  </tr>
                ) : (
                  types.map((type) => (
                    <tr key={type.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {type.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {type.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-3">
                          <button
                            onClick={() => router.push(`/type/edit/${type.id}`)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <FiEdit2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(type.id)}
                            disabled={deleteId === type.id}
                            className={`text-red-600 hover:text-red-900 ${
                              deleteId === type.id ? "opacity-50 cursor-not-allowed" : ""
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