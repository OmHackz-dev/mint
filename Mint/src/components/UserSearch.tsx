import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, User, MessageCircle, X } from 'lucide-react'
import { supabase, Profile } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import toast from 'react-hot-toast'

interface UserSearchProps {
  onStartChat: (userId: string) => void
  onClose: () => void
}

export const UserSearch: React.FC<UserSearchProps> = ({ onStartChat, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Profile[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    if (searchQuery.trim().length >= 2) {
      searchUsers()
    } else {
      setSearchResults([])
    }
  }, [searchQuery])

  const searchUsers = async () => {
    if (!searchQuery.trim() || !user) return

    setIsSearching(true)
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .or(`username.ilike.%${searchQuery}%,full_name.ilike.%${searchQuery}%`)
        .neq('id', user.id)
        .limit(10)

      if (error) throw error
      setSearchResults(data || [])
    } catch (error) {
      console.error('Error searching users:', error)
      toast.error('Error searching users')
    } finally {
      setIsSearching(false)
    }
  }

  const handleStartChat = async (targetUserId: string) => {
    try {
      // Check if chat already exists
      const { data: existingChats, error: chatError } = await supabase
        .from('chats')
        .select('*')
        .contains('participant_ids', [user?.id, targetUserId])

      if (chatError) throw chatError

      if (existingChats && existingChats.length > 0) {
        // Chat exists, navigate to it
        onStartChat(existingChats[0].id)
      } else {
        // Create new chat
        const { data: newChat, error: createError } = await supabase
          .from('chats')
          .insert([
            {
              participant_ids: [user?.id, targetUserId],
            }
          ])
          .select()
          .single()

        if (createError) throw createError

        if (newChat) {
          onStartChat(newChat.id)
          toast.success('Chat started!')
        }
      }
    } catch (error) {
      console.error('Error starting chat:', error)
      toast.error('Error starting chat')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Find People
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by username or name..."
              className="input pl-10 w-full"
              autoFocus
            />
          </div>
        </div>

        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <AnimatePresence>
            {isSearching ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-8"
              >
                <div className="w-8 h-8 border-2 border-mint-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">Searching...</p>
              </motion.div>
            ) : searchResults.length > 0 ? (
              <div className="space-y-3">
                {searchResults.map((profile) => (
                  <motion.div
                    key={profile.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex-shrink-0">
                      {profile.avatar_url ? (
                        <img
                          src={profile.avatar_url}
                          alt={profile.username}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                          <User className="w-5 h-5 text-gray-400" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {profile.full_name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        @{profile.username}
                      </p>
                      {profile.bio && (
                        <p className="text-xs text-gray-400 dark:text-gray-500 truncate mt-1">
                          {profile.bio}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => handleStartChat(profile.id)}
                      className="flex-shrink-0 p-2 bg-mint-500 hover:bg-mint-600 text-white rounded-lg transition-colors"
                      title="Start chat"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </div>
            ) : searchQuery.trim().length >= 2 ? (
              <motion.div
                key="no-results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-8"
              >
                <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No users found</p>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  Try a different search term
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="initial"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-8"
              >
                <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">Search for people</p>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  Type a username or name to get started
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  )
}
