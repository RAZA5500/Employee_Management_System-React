import React, { useCallback, useEffect, useState } from 'react'
import { Plus, Search, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { api } from '../api/client'
import { useAuth } from '../context/AuthContext'
import { LEAVE_STATUSES } from '../assets/assets'
import LeaveForm from '../components/LeaveForm'
import LeaveActionsMenu from '../components/LeaveActionsMenu'
import ConfirmDialog from '../components/ConfirmDialog'

const STATUS_BADGE = {
  PENDING: "badge-warning",
  APPROVED: "badge-success",
  REJECTED: "badge-danger",
}

const getEmployee = (leave) => leave.employeeId

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })

const Leave = () => {

  const { role } = useAuth()
  const isAdmin = role === "ADMIN"
  const [leaves, setLeaves] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("")
  const [showApplyModal, setShowApplyModal] = useState(false)
  const [editLeave, setEditLeave] = useState(null)
  const [deleteLeaveId, setDeleteLeaveId] = useState(null)

  const fetchLeaves = useCallback(async () => {
    setLoading(true)
    try {
      const data = await api.get('/leaves', { status: selectedStatus })
      setLeaves(data)
    } catch (err) {
      toast.error(err.message || "Failed to load leave requests")
    } finally {
      setLoading(false)
    }
  }, [selectedStatus])

  useEffect(() => {
    fetchLeaves()
  }, [fetchLeaves])

  const filtered = leaves.filter((lv) => {
    const emp = getEmployee(lv)
    const text = `${emp?.firstName} ${emp?.lastName} ${lv.type} ${lv.reason}`.toLowerCase()
    return text.includes(search.toLowerCase())
  })

  const handleApplyLeave = () => {
    setShowApplyModal(false)
    fetchLeaves()
  }

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.patch(`/leaves/${id}`, { status })
      const message = status === "PENDING" ? "Leave request marked as pending" : `Leave request ${status.toLowerCase()}`
      toast.success(message)
      fetchLeaves()
    } catch (err) {
      toast.error(err.message || "Failed to update leave request")
    }
  }

  const handleUpdateLeave = () => {
    setEditLeave(null)
    fetchLeaves()
  }

  const handleDeleteLeave = async () => {
    try {
      await api.del(`/leaves/${deleteLeaveId}`)
      toast.success("Leave request deleted")
      fetchLeaves()
    } catch (err) {
      toast.error(err.message || "Failed to delete leave request")
    } finally {
      setDeleteLeaveId(null)
    }
  }

  return (
    <div className="animate-fade-in">
      {/* ==== header ==== */}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="page-title">Leave</h1>
          <p className="page-subtitle">Manage leave requests</p>
        </div>
        <button
          onClick={() => setShowApplyModal(true)}
          className="btn-primary flex items-center gap-2 w-full sm:w-auto justify-center"
        >
          <Plus size={16} /> Apply Leave
        </button>
      </div>

      {/* ==== search bar ==== */}

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search leave requests..."
            className="w-full pl-10"
            onChange={(e) => setSearch(e.target.value)}
            value={search}
          />
        </div>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="max-w-40"
        >
          <option value="">All Status</option>
          {LEAVE_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status.charAt(0) + status.slice(1).toLowerCase()}
            </option>
          ))}
        </select>
      </div>

      {/* ==== leave table ==== */}

      {loading ? (
        <div className="card overflow-x-auto">
          <table className="table-modern">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Type</th>
                <th>Duration</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  <td>
                    <div className="skeleton h-4 w-28 mb-2" />
                    <div className="skeleton h-3 w-20" />
                  </td>
                  <td><div className="skeleton h-4 w-16" /></td>
                  <td><div className="skeleton h-4 w-32" /></td>
                  <td><div className="skeleton h-4 w-40" /></td>
                  <td><div className="skeleton h-5 w-20 rounded-md" /></td>
                  <td><div className="skeleton h-4 w-16" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-center py-16 text-slate-400 bg-white rounded-2xl border-dashed border-slate-200">
          No leave requests found
        </p>
      ) : (
        <div className="card overflow-x-auto">
          <table className="table-modern">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Type</th>
                <th>Duration</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((lv) => {
                const emp = getEmployee(lv)
                return (
                  <tr key={lv.id}>
                    <td>
                      <p className="font-medium text-slate-900">
                        {emp?.firstName} {emp?.lastName}
                      </p>
                      <p className="text-xs text-slate-500">{emp?.department}</p>
                    </td>
                    <td className="capitalize">{lv.type?.toLowerCase()}</td>
                    <td>
                      {formatDate(lv.startDate)} - {formatDate(lv.endDate)}
                    </td>
                    <td className="max-w-60 truncate">{lv.reason}</td>
                    <td>
                      <span className={`badge ${STATUS_BADGE[lv.status] || ""}`}>{lv.status}</span>
                    </td>
                    <td>
                      <LeaveActionsMenu
                        leave={lv}
                        isAdmin={isAdmin}
                        onEdit={() => setEditLeave(lv)}
                        onChangeStatus={(status) => handleUpdateStatus(lv.id, status)}
                        onDelete={() => setDeleteLeaveId(lv.id)}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* apply leave modal */}

      {showApplyModal && (
        <div
          onClick={() => setShowApplyModal(false)}
          className="fixed bg-black/40 backdrop-blur-sm inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto"
        >
          <div
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-8 animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 pb-0">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Apply for Leave</h2>
                <p className="text-sm text-slate-500 mt-0.5">Submit a new leave request</p>
              </div>
              <button
                onClick={() => setShowApplyModal(false)}
                className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5 text-rose-600" />
              </button>
            </div>
            <div className="p-6">
              <LeaveForm onSuccess={handleApplyLeave} onCancel={() => setShowApplyModal(false)} />
            </div>
          </div>
        </div>
      )}

      {/* edit leave modal */}

      {editLeave && (
        <div
          onClick={() => setEditLeave(null)}
          className="fixed bg-black/40 backdrop-blur-sm inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto"
        >
          <div
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-8 animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 pb-0">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Edit Leave Request</h2>
                <p className="text-sm text-slate-500 mt-0.5">Update the leave request details</p>
              </div>
              <button
                onClick={() => setEditLeave(null)}
                className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5 text-rose-600" />
              </button>
            </div>
            <div className="p-6">
              <LeaveForm
                initialData={editLeave}
                isAdmin={isAdmin}
                onSuccess={handleUpdateLeave}
                onCancel={() => setEditLeave(null)}
              />
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteLeaveId}
        title="Delete leave request"
        message="Are you sure you want to delete this leave request? This action cannot be undone."
        onConfirm={handleDeleteLeave}
        onCancel={() => setDeleteLeaveId(null)}
      />
    </div>
  );
}

export default Leave
