export interface VerifyEmailTypes {
    email?: string
}

export interface LoginTypes {
    email?: string,
    password?: string
}

export interface VerifyEmailReturn {
    email: string, exists: boolean
}