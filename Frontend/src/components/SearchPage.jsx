import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import axios from "axios"
import { Search, X, User, Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogPortal, DialogClose } from "./ui/dialog"

export default function SearchDialog({ open, onOpenChange }) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Fetch initial 10 users when dialog opens
  useEffect(() => {
    if (open) fetchUsers("")
  }, [open])

  const fetchUsers = async (searchQuery) => {
    setError("")
    try {
      const url = searchQuery.trim()
        ? `${import.meta.env.VITE_API_URL}/api/user/searchuser?username=${searchQuery}`
        : ``
      if(url === '') {
        setResults([]);
        return;
      }
      
      const res = await axios.get(url)
      if (!res.data.success) throw new Error("Failed to fetch")

      const newResults = res.data.users
      const isDifferent =
        newResults.length !== results.length ||
        newResults.some((user, idx) => user._id !== results[idx]?._id)
        
      if (isDifferent) {
        setLoading(true)
        setResults(newResults)
        setTimeout(() => setLoading(false), 200)
      }
    } catch (err) {
      console.error(err)
      setError("Something went wrong. Try again.")
    } finally {
      setLoading(false)
    }
  }

  // Debounced search
  useEffect(() => {
    const debounce = setTimeout(() => fetchUsers(query), 400)
    return () => clearTimeout(debounce)
  }, [query])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogContent className="bg-white rounded-2xl shadow-2xl overflow-hidden sm:max-w-2xl w-full p-0">
          <DialogHeader className="border-b p-4 text-center relative">
            <DialogTitle className="text-lg font-semibold text-gray-800">Search Users</DialogTitle>
            <DialogClose className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100">
              <X className="w-5 h-5" />
            </DialogClose>
          </DialogHeader>

          <div className="p-6 flex flex-col gap-4">
            {/* Search Input */}
            <div className="flex items-center gap-2 border rounded-xl px-3 py-2 shadow-sm transition-all focus-within:ring-2 focus-within:ring-indigo-400 focus-within:border-indigo-400">
              {loading ? (
                <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
              ) : (
                <Search className="w-5 h-5 text-gray-400" />
              )}
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search username..."
                className="w-full focus:outline-none text-gray-700 placeholder-gray-400"
              />
              {query && (
                <button 
                  onClick={() => setQuery("")}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>

            {/* Loading / Error */}
            <AnimatePresence>
              {loading && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex justify-center items-center py-2">
                    <Loader2 className="w-5 h-5 text-indigo-500 animate-spin mr-2" />
                    <p className="text-gray-500 text-sm">Searching...</p>
                  </div>
                </motion.div>
              )}
              
              {error && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm text-center bg-red-50 py-2 rounded-lg"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Results */}
            <div className="max-h-72 overflow-y-auto pr-2">
              <AnimatePresence mode="wait">
                {results.length === 0 && !loading && (
                  <motion.div
                    key="no-results"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex flex-col items-center justify-center py-8 text-gray-500"
                  >
                    <User className="w-12 h-12 mb-3 opacity-50" />
                    <p className="text-center">
                      {query ? "No users found." : "Start typing to search users."}
                    </p>
                  </motion.div>
                )}

                {results.length > 0 && (
                  <motion.div
                    key="results-list"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-2"
                  >

                    
                    {results.map((user, idx) => (
                      <motion.div
                        key={user._id || idx}
                        onClick={() => {
                          window.location.href = `/profile/${user._id}`
                          onOpenChange(false)
                        }}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3, delay: idx * 0.03 }}
                        whileHover={{ scale: 1.01 }}
                        className="p-3 border rounded-xl bg-gray-50 hover:bg-indigo-50 transition-all flex items-center gap-3 cursor-pointer group"
                      >
                        <motion.img
                          initial={{ scale: 0.8 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.2 }}
                          src={user.profilePicture || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"}
                          alt="profile"
                          className="w-10 h-10 rounded-full object-cover flex-shrink-0 border-2 border-white group-hover:border-indigo-200 transition-colors"
                        />
                        <span className="font-medium text-gray-800 group-hover:text-indigo-600 transition-colors">
                          {user.username}
                        </span>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  )
}