import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, User, Eye, EyeOff, Leaf } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { PressHoldCaptcha } from './PressHoldCaptcha'
import toast from 'react-hot-toast'

interface AuthFormsProps {
  onSuccess: () => void
}

export const AuthForms: React.FC<AuthFormsProps> = ({ onSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [fullName, setFullName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [captchaComplete, setCaptchaComplete] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { signUp, signIn } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!captchaComplete) {
      toast.error('Please complete the verification first')
      return
    }

    setIsLoading(true)
    try {
      if (isSignUp) {
        await signUp(email, password, username, fullName)
        toast.success('Account created! Please check your email to verify your account.')
      } else {
        await signIn(email, password)
        onSuccess()
      }
    } catch (error) {
      console.error('Auth error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setEmail('')
    setPassword('')
    setUsername('')
    setFullName('')
    setCaptchaComplete(false)
  }

  const toggleMode = () => {
    setIsSignUp(!isSignUp)
    resetForm()
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="flex items-center justify-center mb-4">
          <img src="/mint.png" alt="Mint" className="w-12 h-12 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Mint</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          {isSignUp ? 'Create your account' : 'Welcome back'}
        </p>
      </motion.div>

      <motion.form
        key={isSignUp ? 'signup' : 'signin'}
        initial={{ opacity: 0, x: isSignUp ? 20 : -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: isSignUp ? -20 : 20 }}
        transition={{ duration: 0.3 }}
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        {isSignUp && (
          <>
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="input pl-10"
                  placeholder="Choose a username"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="fullName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="input pl-10"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>
          </>
        )}

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input pl-10"
              placeholder="Enter your email"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input pl-10 pr-10"
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <PressHoldCaptcha
          onComplete={() => setCaptchaComplete(true)}
          className="mt-6"
        />

        <motion.button
          type="submit"
          disabled={!captchaComplete || isLoading}
          className="btn-primary w-full h-12 text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>{isSignUp ? 'Creating account...' : 'Signing in...'}</span>
            </div>
          ) : (
            <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
          )}
        </motion.button>
      </motion.form>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-center mt-6"
      >
        <p className="text-gray-600 dark:text-gray-400">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}
          <button
            onClick={toggleMode}
            className="ml-1 text-mint-600 hover:text-mint-700 dark:text-mint-400 dark:hover:text-mint-300 font-medium"
          >
            {isSignUp ? 'Sign in' : 'Sign up'}
          </button>
        </p>
      </motion.div>
    </div>
  )
}
