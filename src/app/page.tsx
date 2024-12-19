"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { FiDollarSign, FiBriefcase, FiBook, FiList, FiCreditCard, FiGrid, FiPieChart } from "react-icons/fi"

interface CardProps {
  title: string
  addHref: string
  viewHref: string
  icon: React.ReactNode
  color: string
}

function Card({ title, addHref, viewHref, icon, color }: CardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col space-y-4 border border-gray-700 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-gray-700 to-gray-600 opacity-50"></div>
      <div className={`text-4xl ${color} relative z-10 mb-2`}>
        <div className="absolute inset-0 bg-gradient-to-r from-current to-transparent opacity-50 blur-lg"></div>
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-white relative z-10">{title}</h3>
      <div className="flex space-x-4 relative z-10">
        <Link
          href={addHref}
          className={`flex-1 ${color.replace('text-', 'bg-')} text-white py-2 px-4 rounded-lg hover:opacity-90 transition-opacity text-center`}
        >
          Add New
        </Link>
        <Link
          href={viewHref}
          className={`flex-1 bg-gray-700 ${color} py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors text-center`}
        >
          View
        </Link>
      </div>
    </motion.div>
  )
}

export default function HomePage() {
  const cards = [
    {
      title: "Transactions",
      addHref: "/transactions/new",
      viewHref: "/transactions",
      icon: <FiDollarSign />,
      color: "text-green-500",
    },
    {
      title: "Business",
      addHref: "/business/new",
      viewHref: "/business",
      icon: <FiBriefcase />,
      color: "text-blue-500",
    },
    {
      title: "Ledger",
      addHref: "/ledger/new",
      viewHref: "/ledger",
      icon: <FiBook />,
      color: "text-yellow-500",
    },
    {
      title: "Head",
      addHref: "/head/new",
      viewHref: "/head",
      icon: <FiList />,
      color: "text-purple-500",
    },
    {
      title: "Mode",
      addHref: "/mode/new",
      viewHref: "/mode",
      icon: <FiCreditCard />,
      color: "text-pink-500",
    },
    {
      title: "Type",
      addHref: "/type/new",
      viewHref: "/type",
      icon: <FiGrid />,
      color: "text-indigo-500",
    },
    {
      title: "Reports",
      addHref: "/reports/new",
      viewHref: "/reports",
      icon: <FiPieChart />,
      color: "text-red-500",
    },
  ]

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-white mb-4 relative inline-block"
          >
            <span className="relative z-10">Baby Accounts</span>
            <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-75 blur-sm animate-pulse"></span>
          </motion.h1>
          <div className="h-1 w-20 bg-blue-600 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                title={card.title}
                addHref={card.addHref}
                viewHref={card.viewHref}
                icon={card.icon}
                color={card.color}
              />
            </motion.div>
          ))}
        </div>
      </div>
      <style jsx global>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: .5;
          }
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  )
}