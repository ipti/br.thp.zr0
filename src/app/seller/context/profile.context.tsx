"use client";

import { Permission, Profile } from "@/app/middleware/use_permission";

import { createContext, ReactNode, useContext, useEffect, useState } from "react";

interface ProfileContextType {
    profile: Profile | undefined
}

export const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children, token }: { children: ReactNode; token: {
    name: string;
    value: string;
} }) => {
    const [profile, setProfile] = useState<Profile | undefined>(undefined);

    useEffect(() => {
        if (!token) return;

        async function fetchProfile() {
            const result = await Permission(token);
            setProfile(result);
        }

        fetchProfile();
    }, [token]);

    return <ProfileContext.Provider value={{ profile }}>{children}</ProfileContext.Provider>;
};

export const useProfile = () => {
    const context = useContext(ProfileContext);
    if (!context) <></>;
    return context;
}
