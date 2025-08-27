import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Palette, Smile, Paperclip, X } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { supabase, Message, Chat, Profile } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { formatDistanceToNow } from 'date-fns'
import toast from 'react-hot-toast'

interface ChatInterfaceProps {
  chatId: string
  onClose: () => void
}

const colorOptions = [
  { name: 'Default', value: '' },
  { name: 'Red', value: 'text-red-500' },
  { name: 'Blue', value: 'text-blue-500' },
  { name: 'Green', value: 'text-green-500' },
  { name: 'Purple', value: 'text-purple-500' },
  { name: 'Orange', value: 'text-orange-500' },
  { name: 'Pink', value: 'text-pink-500' },
]

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ chatId, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [chat, setChat] = useState<Chat | null>(null)
  const [participants, setParticipants] = useState<Profile[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { user } = useAuth()

  useEffect(() => {
    fetchChatData()
    subscribeToMessages()
  }, [chatId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const fetchChatData = async () => {
    try {
      // Fetch chat details
      const { data: chatData, error: chatError } = await supabase
        .from('chats')
        .select('*')
        .eq('id', chatId)
        .single()

      if (chatError) throw chatError
      setChat(chatData)

      // Fetch participants
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('id', chatData.participant_ids)

      if (profilesError) throw profilesError
      setParticipants(profiles || [])

      // Fetch messages
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true })

      if (messagesError) throw messagesError
      setMessages(messagesData || [])
    } catch (error) {
      console.error('Error fetching chat data:', error)
      toast.error('Error loading chat')
    } finally {
      setIsLoading(false)
    }
  }

  const subscribeToMessages = () => {
    const subscription = supabase
      .channel(`chat:${chatId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `chat_id=eq.${chatId}`,
      }, (payload) => {
        setMessages(prev => [...prev, payload.new as Message])
      })
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !user) return

    try {
      const { error } = await supabase
        .from('messages')
        .insert([
          {
            chat_id: chatId,
            sender_id: user.id,
            content: newMessage.trim(),
            color: selectedColor,
          }
        ])

      if (error) throw error

      setNewMessage('')
      setSelectedColor('')
    } catch (error) {
      console.error('Error sending message:', error)
      toast.error('Error sending message')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const getParticipantName = (senderId: string) => {
    const participant = participants.find(p => p.id === senderId)
    return participant ? participant.full_name : 'Unknown User'
  }

  const getParticipantAvatar = (senderId: string) => {
    const participant = participants.find(p => p.id === senderId)
    return participant?.avatar_url
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
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">
              {participants.filter(p => p.id !== user?.id).map(p => p.full_name).join(', ')}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {participants.length} participant{participants.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs lg:max-w-md ${message.sender_id === user?.id ? 'order-2' : 'order-1'}`}>
                {message.sender_id !== user?.id && (
                  <div className="flex items-center space-x-2 mb-1">
                    {getParticipantAvatar(message.sender_id) ? (
                      <img
                        src={getParticipantAvatar(message.sender_id)}
                        alt="Avatar"
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <span className="text-xs text-gray-500">?</span>
                      </div>
                    )}
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {getParticipantName(message.sender_id)}
                    </span>
                  </div>
                )}
                
                <div
                  className={`p-3 rounded-lg ${
                    message.sender_id === user?.id
                      ? 'bg-mint-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                  }`}
                >
                  <div className={`prose prose-sm max-w-none ${message.color} ${
                    message.sender_id === user?.id ? 'prose-invert' : ''
                  }`}>
                    <ReactMarkdown
                      components={{
                        code({ node, inline, className, children, ...props }) {
                          const match = /language-(\w+)/.exec(className || '')
                          return !inline && match ? (
                            <SyntaxHighlighter
                              style={tomorrow}
                              language={match[1]}
                              PreTag="div"
                              {...props}
                            >
                              {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                          ) : (
                            <code className={className} {...props}>
                              {children}
                            </code>
                          )
                        }
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  </div>
                </div>
                
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">
                  {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-end space-x-2">
          <div className="flex-1 relative">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="input resize-none min-h-[40px] max-h-32"
              rows={1}
            />
            
            {/* Color Picker */}
            <div className="absolute right-2 bottom-2">
              <button
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                title="Text color"
              >
                <Palette className="w-4 h-4 text-gray-500" />
              </button>
              
              {showColorPicker && (
                <div className="absolute bottom-full right-0 mb-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-2">
                  <div className="grid grid-cols-2 gap-1">
                    {colorOptions.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => {
                          setSelectedColor(color.value)
                          setShowColorPicker(false)
                        }}
                        className={`px-2 py-1 text-xs rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
                          selectedColor === color.value ? 'bg-mint-100 dark:bg-mint-900' : ''
                        }`}
                      >
                        {color.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <button
            onClick={sendMessage}
            disabled={!newMessage.trim()}
            className="btn-primary p-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
