import React from 'react'
import { motion } from 'framer-motion'
import { User, Edit, Calendar, MapPin, Link, Mail } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { format } from 'date-fns'

export const ProfileView: React.FC = () => {
  const { profile } = useAuth()

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Profile not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Profile Header */}
        <div className="text-center">
          <div className="relative inline-block mb-4">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.username}
                className="w-32 h-32 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-lg"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center border-4 border-white dark:border-gray-800 shadow-lg">
                <User className="w-16 h-16 text-gray-400" />
              </div>
            )}
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {profile.full_name}
          </h1>
          
          <p className="text-xl text-mint-600 dark:text-mint-400 font-medium mb-4">
            @{profile.username}
          </p>
          
          {profile.bio && (
            <p className="text-gray-600 dark:text-gray-400 text-lg max-w-md mx-auto">
              {profile.bio}
            </p>
          )}
        </div>

        {/* Profile Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 text-center"
          >
            <div className="text-2xl font-bold text-mint-600 dark:text-mint-400">
              {profile.username.length}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Username Length
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 text-center"
          >
            <div className="text-2xl font-bold text-mint-600 dark:text-mint-400">
              {profile.bio ? profile.bio.length : 0}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Bio Characters
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 text-center"
          >
            <div className="text-2xl font-bold text-mint-600 dark:text-mint-400">
              {profile.avatar_url ? 'Yes' : 'No'}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Avatar Set
            </div>
          </motion.div>
        </div>

        {/* Profile Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Profile Information
            </h2>
          </div>
          
          <div className="p-6 space-y-4">
            <div className="flex items-center space-x-3">
              <User className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Username</p>
                <p className="text-gray-900 dark:text-white">@{profile.username}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <User className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Full Name</p>
                <p className="text-gray-900 dark:text-white">{profile.full_name}</p>
              </div>
            </div>
            
            {profile.bio && (
              <div className="flex items-start space-x-3">
                <Link className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Bio</p>
                  <p className="text-gray-900 dark:text-white">{profile.bio}</p>
                </div>
              </div>
            )}
            
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Member Since</p>
                <p className="text-gray-900 dark:text-white">
                  {format(new Date(profile.created_at), 'MMMM yyyy')}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Updated</p>
                <p className="text-gray-900 dark:text-white">
                  {format(new Date(profile.updated_at), 'MMMM d, yyyy')}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Want to update your profile?
          </p>
          <button className="btn-primary inline-flex items-center">
            <Edit className="w-4 h-4 mr-2" />
            Edit Profile
          </button>
        </motion.div>
      </motion.div>
    </div>
  )
}
