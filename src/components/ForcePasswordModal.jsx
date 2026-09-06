import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import { KeyRoundIcon, Loader2Icon } from 'lucide-react'
import toast from 'react-hot-toast'
import { api } from '../api/client'
import { useAuth } from '../context/AuthContext'
import PasswordInput from './PasswordInput'

const ForcePasswordModal = () => {

    const { mustChangePassword, markPasswordChanged } = useAuth()
    const [loading, setLoading] = useState(false)

    if (!mustChangePassword) return null

    const handleSubmit = async (e) => {
        e.preventDefault()

        const formData = new FormData(e.target)
        const data = Object.fromEntries(formData.entries())

        if (data.newPassword !== data.confirmPassword) {
            toast.error("New passwords do not match")
            return
        }
        if (data.newPassword.length < 8) {
            toast.error("New password must be at least 8 characters")
            return
        }

        setLoading(true)
        try {
            await api.patch('/users/me', {
                currentPassword: data.currentPassword,
                password: data.newPassword,
            })
            markPasswordChanged()
            toast.success("Password set successfully")
        } catch (err) {
            toast.error(err.message || "Failed to set password")
        } finally {
            setLoading(false)
        }
    }

    return createPortal(
        <div className="fixed bg-black/40 backdrop-blur-sm inset-0 z-[60] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-fade-in">
                <div className="flex items-start gap-4 mb-6">
                    <div className="p-2.5 rounded-full bg-indigo-50 shrink-0">
                        <KeyRoundIcon className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-900">Set a new password</h3>
                        <p className="text-sm text-slate-500 mt-1">
                            You're using a temporary password. Please set your own password to continue.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 text-sm text-slate-700">
                    <PasswordInput
                        label="Temporary Password"
                        name="currentPassword"
                        required
                        autoFocus
                    />
                    <PasswordInput label="New Password" name="newPassword" required minLength={8} />
                    <PasswordInput
                        label="Confirm New Password"
                        name="confirmPassword"
                        required
                        minLength={8}
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
                    >
                        {loading && <Loader2Icon className="animate-spin w-4 h-4" />}
                        Set Password
                    </button>
                </form>
            </div>
        </div>,
        document.body
    );
}

export default ForcePasswordModal
