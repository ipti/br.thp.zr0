'use client'

import { Profile } from '@/app/middleware/use_permission'

import { createContext, ReactNode, useContext } from 'react'

interface ProfileContextType {
  profile: Profile | undefined
}

export const ProfileContext = createContext<ProfileContextType | undefined>(
  undefined
)

export const ProfileProvider = ({
  children,
  profile,
}: {
  children: ReactNode
  profile: Profile | undefined
}) => {
  return (
    <ProfileContext.Provider value={{ profile }}>
      {children}
    </ProfileContext.Provider>
  )
}

export const useProfile = () => {
  const context = useContext(ProfileContext)
  if (!context) {
    throw new Error('useProfile must be used inside ProfileProvider')
  }
  return context
}
