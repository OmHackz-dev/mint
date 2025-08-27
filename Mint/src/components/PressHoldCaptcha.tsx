import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Shield } from 'lucide-react'

interface PressHoldCaptchaProps {
  onComplete: () => void
  duration?: number
  className?: string
}

export const PressHoldCaptcha: React.FC<PressHoldCaptchaProps> = ({
  onComplete,
  duration = 2000,
  className = ''
}) => {
  const [isPressed, setIsPressed] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number | null>(null)

  useEffect(() => {
    if (isPressed && !isComplete) {
      startTimeRef.current = Date.now()
      intervalRef.current = setInterval(() => {
        const elapsed = Date.now() - (startTimeRef.current || 0)
        const newProgress = Math.min((elapsed / duration) * 100, 100)
        setProgress(newProgress)

        if (newProgress >= 100) {
          setIsComplete(true)
          onComplete()
        }
      }, 16) // 60fps
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isPressed, isComplete, duration, onComplete])

  const handleMouseDown = () => {
    if (!isComplete) {
      setIsPressed(true)
    }
  }

  const handleMouseUp = () => {
    if (!isComplete) {
      setIsPressed(false)
      setProgress(0)
    }
  }

  const handleMouseLeave = () => {
    if (!isComplete) {
      setIsPressed(false)
      setProgress(0)
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault()
    if (!isComplete) {
      setIsPressed(true)
    }
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault()
    if (!isComplete) {
      setIsPressed(false)
      setProgress(0)
    }
  }

  return (
    <div className={`relative ${className}`}>
      <motion.button
        className={`
          relative w-full h-16 rounded-xl border-2 font-medium text-lg
          transition-all duration-200 ease-out
          ${isComplete
            ? 'bg-mint-500 border-mint-600 text-white cursor-default'
            : isPressed
            ? 'bg-mint-100 border-mint-300 text-mint-700 dark:bg-mint-900 dark:border-mint-700 dark:text-mint-200'
            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700'
          }
        `}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        disabled={isComplete}
        whileHover={!isComplete ? { scale: 1.02 } : {}}
        whileTap={!isComplete ? { scale: 0.98 } : {}}
      >
        <AnimatePresence>
          {isComplete ? (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center justify-center space-x-2"
            >
              <Check className="w-6 h-6" />
              <span>Verification Complete!</span>
            </motion.div>
          ) : (
            <motion.div
              key="verifying"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center space-x-2"
            >
              <Shield className="w-5 h-5" />
              <span>
                {isPressed ? 'Hold to verify...' : 'Press and hold to verify'}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress bar */}
        {isPressed && !isComplete && (
          <motion.div
            className="absolute bottom-0 left-0 h-1 bg-mint-500 rounded-b-xl"
            style={{ width: `${progress}%` }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        )}

        {/* Ripple effect */}
        {isPressed && !isComplete && (
          <motion.div
            className="absolute inset-0 rounded-xl bg-mint-200 dark:bg-mint-800 opacity-30"
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale: 1, opacity: 0.3 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </motion.button>

      {/* Instructions */}
      {!isComplete && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-gray-500 dark:text-gray-400 text-center mt-2"
        >
          This helps prevent automated bots from accessing your account
        </motion.p>
      )}
    </div>
  )
}
