// context/ProfileContext.tsx
"use client";

import { Permission, Profile } from "@/app/middleware/use_permission";
import { cookies } from "next/headers";

import { createContext, ReactNode, useContext, useEffect } from "react";

interface ProfileContextType {
  profile: Promise<Profile | undefined>
}

export const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {

      const cookieStore = cookies();
      var profile = Promise.resolve<Profile | undefined>(undefined);
      
      useEffect(() => {
          
          async function fetchProfile() {
            const token = await cookieStore.get('access_token');
            return await Permission(token)
        }
        profile = fetchProfile();

      }, []);
  

  return (
    <ProfileContext.Provider value={{ profile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) <></>;
  return context;
}
