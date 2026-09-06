import React, { useCallback, useEffect, useState } from 'react'
import { LogInIcon, LogOutIcon } from 'lucide-react'
import toast from 'react-hot-toast'
import { api } from '../api/client'
import { useAuth } from '../context/AuthContext'
import { getDayTypeDisplay, getWorkingHoursDisplay } from '../assets/assets'
import EmptyState from '../components/EmptyState'
import PageHeader from '../components/PageHeader'

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })

const formatTime = (date) =>
  date ? new Date(date).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }) : "—"

const isToday = (date) => {
  const d = new Date(date)
  const now = new Date()
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate()
}

const Attendance = () => {

  const { role } = useAuth()
  const isAdmin = role === "ADMIN"

  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  const fetchRecords = useCallback(async () => {
    setLoading(true)
    try {
      const data = await api.get(isAdmin ? '/attendance' : '/attendance/me')
      setRecords(data)
    } catch (err) {
      toast.error(err.message || "Failed to load attendance")
    } finally {
      setLoading(false)
    }
  }, [isAdmin])

  useEffect(() => {
    fetchRecords()
  }, [fetchRecords])

  const todayRecord = !isAdmin ? records.find((r) => isToday(r.date)) : null

  const handleCheckIn = async () => {
    setActionLoading(true)
    try {
      await api.post('/attendance/check-in')
      toast.success("Checked in successfully")
      fetchRecords()
    } catch (err) {
      toast.error(err.message || "Failed to check in")
    } finally {
      setActionLoading(false)
    }
  }

  const handleCheckOut = async () => {
    setActionLoading(true)
    try {
      await api.post('/attendance/check-out')
      toast.success("Checked out successfully")
      fetchRecords()
    } catch (err) {
      toast.error(err.message || "Failed to check out")
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Attendance"
        subtitle={isAdmin ? "View attendance records for all employees" : "Track your daily check-in and check-out"}
        action={
          !isAdmin && (
            <div>
              {!todayRecord ? (
                <button
                  onClick={handleCheckIn}
                  disabled={actionLoading}
                  className="btn-primary flex items-center gap-2 disabled:opacity-50"
                >
                  <LogInIcon size={16} /> Check In
                </button>
              ) : !todayRecord.checkOut ? (
                <button
                  onClick={handleCheckOut}
                  disabled={actionLoading}
                  className="btn-primary flex items-center gap-2 disabled:opacity-50"
                >
                  <LogOutIcon size={16} /> Check Out
                </button>
              ) : (
                <span className="badge badge-success">Checked out for today</span>
              )}
            </div>
          )
        }
      />

      {loading ? (
        <div className="card overflow-x-auto">
          <table className="table-modern">
            <thead>
              <tr>
                {isAdmin && <th>Employee</th>}
                <th>Date</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Working Hours</th>
                <th>Day Type</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  {isAdmin && <td><div className="skeleton h-4 w-28" /></td>}
                  <td><div className="skeleton h-4 w-24" /></td>
                  <td><div className="skeleton h-4 w-16" /></td>
                  <td><div className="skeleton h-4 w-16" /></td>
                  <td><div className="skeleton h-4 w-20" /></td>
                  <td><div className="skeleton h-5 w-20 rounded-md" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : records.length === 0 ? (
        <EmptyState message="No attendance records found" />
      ) : (
        <div className="card overflow-x-auto">
          <table className="table-modern">
            <thead>
              <tr>
                {isAdmin && <th>Employee</th>}
                <th>Date</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Working Hours</th>
                <th>Day Type</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r) => {
                const dayType = getDayTypeDisplay(r)
                return (
                  <tr key={r._id}>
                    {isAdmin && (
                      <td>
                        <p className="font-medium text-slate-900">
                          {r.employeeId?.firstName} {r.employeeId?.lastName}
                        </p>
                        <p className="text-xs text-slate-500">{r.employeeId?.department}</p>
                      </td>
                    )}
                    <td>{formatDate(r.date)}</td>
                    <td>{formatTime(r.checkIn)}</td>
                    <td>{formatTime(r.checkOut)}</td>
                    <td>{getWorkingHoursDisplay(r)}</td>
                    <td>
                      {dayType.label !== "—" && (
                        <span className={`badge ${dayType.className}`}>{dayType.label}</span>
                      )}
                      {dayType.label === "—" && "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Attendance
