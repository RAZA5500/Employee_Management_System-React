import React, { useEffect, useState } from 'react'
import { EyeIcon, EyeOffIcon, Loader2Icon } from 'lucide-react'
import toast from 'react-hot-toast'
import { api } from '../api/client'
import { useAuth } from '../context/AuthContext'

const Settings = () => {

  const { profile, refetchProfile, markPasswordChanged } = useAuth()
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [profileLoading, setProfileLoading] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  useEffect(() => {
    setFirstName(profile?.fName || "")
    setLastName(profile?.lName || "")
    setEmail(profile?.email || "")
  }, [profile])

  const initials = `${profile?.fName?.[0] || ""}${profile?.lName?.[0] || ""}`
  const isProfileDirty = firstName !== (profile?.fName || "") ||
    lastName !== (profile?.lName || "") ||
    email !== (profile?.email || "")

  const handleProfileSubmit = async (e) => {
    e.preventDefault()

    if (!isProfileDirty) return

    setProfileLoading(true)
    try {
      await api.patch('/users/me', {
        fName: firstName,
        lName: lastName,
        email,
      })
      await refetchProfile()
      toast.success("Profile updated successfully")
    } catch (err) {
      toast.error(err.message || "Failed to update profile")
    } finally {
      setProfileLoading(false)
    }
  }

  const handlePasswordSubmit = async (e) => {
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

    setPasswordLoading(true)
    try {
      await api.patch('/users/me', {
        currentPassword: data.currentPassword,
        password: data.newPassword,
      })
      markPasswordChanged()
      toast.success("Password updated successfully")
      e.target.reset()
    } catch (err) {
      toast.error(err.message || "Failed to update password")
    } finally {
      setPasswordLoading(false)
    }
  }

  return (
    <div className="animate-fade-in">
      {/* ==== header ==== */}

      <div className="mb-8">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Manage your account preferences</p>
      </div>

      <div className="space-y-6">
        {/* ==== profile information ==== */}

        <form onSubmit={handleProfileSubmit} className="card p-5 sm:p-6">
          <h3 className="font-medium mb-6 pb-4 border-b border-slate-100">
            Profile Information
          </h3>

          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-linear-to-br from-indigo-100 to-slate-100 flex items-center justify-center shrink-0">
                <span className="text-xl font-medium text-indigo-400">
                  {initials || "?"}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">
                  {profile?.fName} {profile?.lName}
                </p>
                <p className="text-xs text-slate-500">{profile?.email}</p>
              </div>
            </div>
            <span className={`badge ${profile?.role === "ADMIN" ? "badge-warning" : "badge-success"}`}>
              {profile?.role === "ADMIN" ? "Administrator" : "Employee"}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm text-slate-700">
            <div>
              <label htmlFor="" className="block mb-2">
                First Name
              </label>
              <input name="firstName" required value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </div>
            <div>
              <label htmlFor="" className="block mb-2">
                Last Name
              </label>
              <input name="lastName" required value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="" className="block mb-2">
                Email
              </label>
              <input type="email" name="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              type="submit"
              disabled={profileLoading || !isProfileDirty}
              className="btn-primary flex items-center gap-2 disabled:opacity-50"
            >
              {profileLoading && <Loader2Icon className="animate-spin w-4 h-4" />}
              Save Changes
            </button>
          </div>
        </form>

        {/* ==== change password ==== */}

        <form onSubmit={handlePasswordSubmit} className="card p-5 sm:p-6">
          <h3 className="font-medium mb-6 pb-4 border-b border-slate-100">
            Change Password
          </h3>

          <div className="grid grid-cols-1 gap-5 text-sm text-slate-700">
            <div>
              <label htmlFor="" className="block mb-2">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrent ? "text" : "password"}
                  name="currentPassword"
                  required
                  className="pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showCurrent ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="" className="block mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNew ? "text" : "password"}
                    name="newPassword"
                    required
                    minLength={8}
                    className="pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showNew ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                  </button>
                </div>
              </div>
              <div>
                <label htmlFor="" className="block mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    name="confirmPassword"
                    required
                    minLength={8}
                    className="pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showConfirm ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              type="submit"
              disabled={passwordLoading}
              className="btn-primary flex items-center gap-2 disabled:opacity-50"
            >
              {passwordLoading && <Loader2Icon className="animate-spin w-4 h-4" />}
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Settings
