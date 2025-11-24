import '../global.css';
import React, { createContext, useContext, useEffect, useState } from 'react'
import { useRouter, useSegments } from 'expo-router'
import { authClient } from '../lib/auth-client'

interface User {
  id: string
  email: string
  name: string
  image?: string | null
}

interface Session {
  id: string
  userId: string
  token: string
  expiresAt: Date
  ipAddress?: string | null | undefined
  userAgent?: string | null | undefined
}

interface AuthContextType {
  user: User | null
  session: Session | null
  isLoading: boolean
  isAuthenticated: boolean
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signUp: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<void>
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>
  refreshSession: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const segments = useSegments()

  const isAuthenticated = !!user

  useEffect(() => {
    checkSession()
  }, [])

  useEffect(() => {
    if (isLoading) return

    const inAuthGroup = segments[0] === '(auth)'

    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/login')
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/home')
    }
  }, [isAuthenticated, segments, isLoading, router])

  const checkSession = async () => {
    try {
      const result = await authClient.getSession()
      
      if (result?.data) {
        setUser(result.data.user)
        setSession(result.data.session) 
      } else {
        setUser(null)
        setSession(null)
      }
    } catch (error) {
      console.error('Error checking session:', error)
      setUser(null)
      setSession(null)
    } finally {
      setIsLoading(false)
    }
  }

  const refreshSession = async () => {
    await checkSession()
  }

  const signIn = async (email: string, password: string) => {
    try {
      const result = await authClient.signIn.email({
        email,
        password,
      })
      
      if (result.error) {
        return { success: false, error: result.error.message }
      }
      
      await checkSession() 
      
      return { success: true }
    } catch (error) {
      console.error('Login error:', error)
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
      return { success: false, error: errorMessage }
    }
  }

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const result = await authClient.signUp.email({
        email,
        password,
        name,
      })
      
      if (result.error) {
        return { success: false, error: result.error.message }
      }
      
      await checkSession()
      
      return { success: true }
    } catch (error) {
      console.error('Sign up error:', error)
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
      return { success: false, error: errorMessage }
    }
  }

  const signInWithGoogle = async () => {
    try {
      const result = await authClient.signIn.social({
        provider: "google",
        callbackURL: `${process.env.EXPO_PUBLIC_SCHEMA}://auth/callback`
      })
      
      if (result.error) {
        return { success: false, error: result.error.message }
      }
      
      await checkSession()
      return { success: true }
    } catch (error) {
      console.error('Google login error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Google login failed'
      return { success: false, error: errorMessage }
    }
  }

  const signOut = async () => {
    try {
      await authClient.signOut()
      setUser(null)
      setSession(null)
    } catch (error) {
      console.error('Sign out error:', error)
      setUser(null)
      setSession(null)
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      session,
      isLoading,
      isAuthenticated,
      signIn,
      signUp,
      signOut,
      signInWithGoogle,
      refreshSession,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}