import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export const ProtectedRoute = () => {
    const { isAuthenticated } = useAuth()
    if (!isAuthenticated) return <Navigate to="/login" replace />
    return <Outlet />
}

export const AdminRoute = () => {
    const { role } = useAuth()
    if (role !== "ADMIN") return <Navigate to="/dashboard" replace />
    return <Outlet />
}
