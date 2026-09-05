import React, { useState } from 'react'
import { Loader2Icon } from 'lucide-react'
import toast from 'react-hot-toast'
import { LEAVE_STATUSES, LEAVE_TYPES } from '../assets/assets'
import { api } from '../api/client'

const LeaveForm = ({ initialData, isAdmin, onSuccess, onCancel }) => {

    const [loading, setLoading] = useState(false)
    const isEditMode = !!initialData

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target)
        const data = Object.fromEntries(formData.entries())

        if (new Date(data.endDate) < new Date(data.startDate)) {
            toast.error("End date cannot be before start date")
            return
        }

        setLoading(true)

        const leave = {
            type: data.type,
            startDate: data.startDate,
            endDate: data.endDate,
            reason: data.reason,
            ...(isEditMode && isAdmin ? { status: data.status } : {}),
        }

        try {
            if (isEditMode) {
                await api.patch(`/leaves/${initialData.id}`, leave)
            } else {
                await api.post('/leaves', leave)
            }
            toast.success(isEditMode ? "Leave request updated" : "Leave request submitted")
            onSuccess()
        } catch (err) {
            toast.error(err.message || "Failed to save leave request")
        } finally {
            setLoading(false)
        }
    }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl animate-fade-in">
      <div className="card p-5 sm:p-6">
        <h3 className="font-medium mb-6 pb-4 border-b border-slate-100">
          Leave Details
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm text-slate-700">
          <div>
            <label htmlFor="" className="block mb-2">
              Leave Type
            </label>
            <select name="type" required defaultValue={initialData?.type || ""}>
              <option value="" disabled>Select leave type</option>
              {LEAVE_TYPES.map((type) => (
                <option key={type} value={type}>{type.charAt(0) + type.slice(1).toLowerCase()}</option>
              ))}
            </select>
          </div>
          {isEditMode && isAdmin ? (
            <div>
              <label htmlFor="" className="block mb-2">
                Status
              </label>
              <select name="status" required defaultValue={initialData?.status}>
                {LEAVE_STATUSES.map((status) => (
                  <option key={status} value={status}>{status.charAt(0) + status.slice(1).toLowerCase()}</option>
                ))}
              </select>
            </div>
          ) : (
            <div />
          )}
          <div>
            <label htmlFor="" className="block mb-2">
              Start Date
            </label>
            <input
              type="date"
              name="startDate"
              required
              defaultValue={initialData?.startDate ? new Date(initialData.startDate).toISOString().slice(0, 10) : ""}
            />
          </div>
          <div>
            <label htmlFor="" className="block mb-2">
              End Date
            </label>
            <input
              type="date"
              name="endDate"
              required
              defaultValue={initialData?.endDate ? new Date(initialData.endDate).toISOString().slice(0, 10) : ""}
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="" className="block mb-2">
              Reason
            </label>
            <textarea
              name="reason"
              rows={3}
              required
              defaultValue={initialData?.reason}
              placeholder="Briefly explain the reason for your leave..."
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3">
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="btn-primary flex items-center gap-2 disabled:opacity-50"
        >
          {loading && <Loader2Icon className="animate-spin w-4 h-4" />}
          {isEditMode ? "Update Request" : "Submit Request"}
        </button>
      </div>
    </form>
  );
}

export default LeaveForm
