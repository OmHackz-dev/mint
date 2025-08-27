import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from './contexts/AuthContext'
import { AuthForms } from './components/AuthForms'
import { Navigation } from './components/Navigation'
import { ChatList } from './components/ChatList'
import { ChatInterface } from './components/ChatInterface'
import { ProfileView } from './components/ProfileView'
import { UserSearch } from './components/UserSearch'

function App() {
  const { user, loading } = useAuth()
  const [currentSection, setCurrentSection] = useState('chats')
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null)
  const [showUserSearch, setShowUserSearch] = useState(false)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-mint-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading Mint...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <AuthForms onSuccess={() => {}} />
        </div>
      </div>
    )
  }

  const handleNavigate = (section: string) => {
    setCurrentSection(section)
    setSelectedChatId(null)
  }

  const handleSelectChat = (chatId: string) => {
    setSelectedChatId(chatId)
    setCurrentSection('chats')
  }

  const handleCloseChat = () => {
    setSelectedChatId(null)
  }

  const renderMainContent = () => {
    if (selectedChatId) {
      return (
        <ChatInterface
          chatId={selectedChatId}
          onClose={handleCloseChat}
        />
      )
    }

    switch (currentSection) {
      case 'chats':
        return (
          <ChatList
            onSelectChat={handleSelectChat}
            onOpenUserSearch={() => setShowUserSearch(true)}
          />
        )
      case 'profile':
        return <ProfileView />
      case 'settings':
        return (
          <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Settings
            </h1>
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <p className="text-gray-600 dark:text-gray-400">
                Settings page coming soon...
              </p>
            </div>
          </div>
        )
      default:
        return (
          <ChatList
            onSelectChat={handleSelectChat}
            onOpenUserSearch={() => setShowUserSearch(true)}
          />
        )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex h-screen">
        {/* Navigation Sidebar */}
        <Navigation
          onNavigate={handleNavigate}
          currentSection={currentSection}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col lg:ml-0">
          <main className="flex-1 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSection + (selectedChatId || '')}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                {renderMainContent()}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>

      {/* User Search Modal */}
      {showUserSearch && (
        <UserSearch
          onStartChat={handleSelectChat}
          onClose={() => setShowUserSearch(false)}
        />
      )}
    </div>
  )
}

export default App
