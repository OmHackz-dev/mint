import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, Search, Plus, User } from 'lucide-react'
import { supabase, Chat, Message, Profile } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { formatDistanceToNow } from 'date-fns'

interface ChatListProps {
  onSelectChat: (chatId: string) => void
  onOpenUserSearch: () => void
}

export const ChatList: React.FC<ChatListProps> = ({ onSelectChat, onOpenUserSearch }) => {
  const [chats, setChats] = useState<Array<Chat & { participants: Profile[], lastMessage?: Message }>>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    fetchChats()
    subscribeToChats()
  }, [])

  const fetchChats = async () => {
    if (!user) return

    try {
      // Fetch chats where user is a participant
      const { data: chatData, error: chatError } = await supabase
        .from('chats')
        .select('*')
        .contains('participant_ids', [user.id])
        .order('updated_at', { ascending: false })

      if (chatError) throw chatError

      // Fetch participants and last messages for each chat
      const chatsWithDetails = await Promise.all(
        (chatData || []).map(async (chat) => {
          // Get participants
          const { data: profiles } = await supabase
            .from('profiles')
            .select('*')
            .in('id', chat.participant_ids)

          // Get last message
          const { data: lastMessage } = await supabase
            .from('messages')
            .select('*')
            .eq('chat_id', chat.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single()

          return {
            ...chat,
            participants: profiles || [],
            lastMessage: lastMessage || undefined,
          }
        })
      )

      setChats(chatsWithDetails)
    } catch (error) {
      console.error('Error fetching chats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const subscribeToChats = () => {
    if (!user) return

    const subscription = supabase
      .channel(`user_chats:${user.id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `chat_id=in.(${chats.map(c => c.id).join(',')})`,
      }, (payload) => {
        // Update chat's last message and move to top
        const newMessage = payload.new as Message
        setChats(prev => {
          const chatIndex = prev.findIndex(c => c.id === newMessage.chat_id)
          if (chatIndex === -1) return prev

          const updatedChats = [...prev]
          const chat = { ...updatedChats[chatIndex] }
          chat.lastMessage = newMessage
          chat.updated_at = newMessage.created_at

          // Move to top
          updatedChats.splice(chatIndex, 1)
          updatedChats.unshift(chat)

          return updatedChats
        })
      })
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }

  const getOtherParticipant = (chat: Chat & { participants: Profile[] }) => {
    return chat.participants.find(p => p.id !== user?.id)
  }

  const getLastMessagePreview = (message?: Message) => {
    if (!message) return 'No messages yet'
    
    const content = message.content
    if (content.length > 50) {
      return content.substring(0, 50) + '...'
    }
    return content
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-2 border-mint-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Chats</h2>
          <button
            onClick={onOpenUserSearch}
            className="p-2 bg-mint-500 hover:bg-mint-600 text-white rounded-lg transition-colors"
            title="Start new chat"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence>
          {chats.length > 0 ? (
            chats.map((chat, index) => {
              const otherParticipant = getOtherParticipant(chat)
              if (!otherParticipant) return null

              return (
                <motion.div
                  key={chat.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => onSelectChat(chat.id)}
                  className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors border-b border-gray-100 dark:border-gray-800"
                >
                  <div className="flex items-center space-x-3">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      {otherParticipant.avatar_url ? (
                        <img
                          src={otherParticipant.avatar_url}
                          alt={otherParticipant.username}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                          <User className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Chat Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {otherParticipant.full_name}
                        </h3>
                        {chat.lastMessage && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatDistanceToNow(new Date(chat.lastMessage.created_at), { addSuffix: true })}
                          </span>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        @{otherParticipant.username}
                      </p>
                      
                      {chat.lastMessage && (
                        <p className="text-sm text-gray-600 dark:text-gray-300 truncate mt-1">
                          {getLastMessagePreview(chat.lastMessage)}
                        </p>
                      )}
                    </div>

                    {/* Unread indicator */}
                    {chat.lastMessage && chat.lastMessage.sender_id !== user?.id && (
                      <div className="flex-shrink-0">
                        <div className="w-3 h-3 bg-mint-500 rounded-full"></div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )
            })
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <MessageCircle className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No chats yet
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Start a conversation with someone new
              </p>
              <button
                onClick={onOpenUserSearch}
                className="btn-primary"
              >
                <Plus className="w-4 h-4 mr-2" />
                Start New Chat
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
