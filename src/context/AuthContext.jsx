import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { api, clearSession, getRole, getToken, setSession } from '../api/client'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(getToken())
    const [role, setRole] = useState(getRole())
    const [profile, setProfile] = useState(null)

    const refetchProfile = useCallback(async () => {
        if (!getToken()) {
            setProfile(null)
            return
        }
        try {
            const data = await api.get('/users/me')
            setProfile(data)
        } catch {
            setProfile(null)
        }
    }, [])

    useEffect(() => {
        refetchProfile()
    }, [refetchProfile, token])

    const login = useCallback(async (email, password) => {
        const res = await api.post('/auth/login', { email, password })
        setSession(res.access_token, res.role)
        setToken(res.access_token)
        setRole(res.role)
        return res
    }, [])

    const logout = useCallback(() => {
        clearSession()
        setToken(null)
        setRole(null)
        setProfile(null)
    }, [])

    const markPasswordChanged = useCallback(() => {
        setProfile((p) => (p ? { ...p, mustChangePassword: false } : p))
    }, [])

    const value = useMemo(() => ({
        token,
        role,
        profile,
        isAuthenticated: !!token,
        mustChangePassword: !!profile?.mustChangePassword,
        login,
        logout,
        markPasswordChanged,
        refetchProfile,
    }), [token, role, profile, login, logout, markPasswordChanged, refetchProfile])

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
    return ctx
}
