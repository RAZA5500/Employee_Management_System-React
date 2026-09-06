import React, { useState } from 'react'
import { Loader2Icon } from 'lucide-react'
import toast from 'react-hot-toast'
import { DEMO_LOCK_MESSAGE, DEPARTMENTS, isDemoAccount } from '../assets/assets'
import { api } from '../api/client'
import DemoNotice from './DemoNotice'

const EMPLOYMENT_STATUSES = ["ACTIVE", "INACTIVE", "ON_LEAVE", "TERMINATED"]

const EmployeeForm = ({ initialData, onSuccess, onCancel }) => {

    const [loading, setLoading] = useState(false)
    const isEditMode = !!initialData
    const isDemoEmployee = isEditMode && isDemoAccount(initialData?.email)

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target)
        const data = Object.fromEntries(formData.entries())

        const renamesDemoEmployee = isDemoEmployee && (
            data.firstName !== initialData.firstName ||
            data.lastName !== initialData.lastName ||
            data.email !== initialData.email
        )
        if (renamesDemoEmployee) {
            toast.error(DEMO_LOCK_MESSAGE)
            return
        }

        setLoading(true)

        const employee = {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone,
            department: data.department,
            position: data.position,
            employmentStatus: data.employmentStatus,
            joinDate: data.joinDate,
            basicSalary: Number(data.basicSalary) || 0,
            allowances: Number(data.allowances) || 0,
            deductions: Number(data.deductions) || 0,
            bio: data.bio,
        }
        if (!isEditMode) {
            employee.password = data.password
        }

        try {
            if (isEditMode) {
                await api.patch(`/employees/${initialData.id}`, employee)
            } else {
                await api.post('/employees', employee)
            }
            toast.success(isEditMode ? "Employee updated successfully" : "Employee created successfully")
            onSuccess()
        } catch (err) {
            toast.error(err.message || "Failed to save employee")
        } finally {
            setLoading(false)
        }
    }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-3xl animate-fade-in"
    >
      {/* personal info */}

      <div className="card p-5 sm:p-6">
        <h3 className="font-medium mb-6 pb-4 border-b border-slate-100">
          Personal Information
        </h3>
        {isDemoEmployee && (
          <DemoNotice className="rounded-xl p-3.5 mb-6">
            This is the <span className="font-medium">shared demo employee</span>. Its name and
            email are locked so the published sign-in keeps working — the rest of the profile
            is still editable.
          </DemoNotice>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm text-slate-700">
          <div>
            <label htmlFor="" className="block mb-2">
              First Name
            </label>
            <input
              name="firstName"
              required
              defaultValue={initialData?.firstName}
              placeholder="John"
            />
          </div>
          <div>
            <label htmlFor="" className="block mb-2">
              Last Name
            </label>
            <input
              name="lastName"
              required
              defaultValue={initialData?.lastName}
              placeholder="Doe"
            />
          </div>
          <div>
            <label htmlFor="" className="block mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              defaultValue={initialData?.email}
              placeholder="john@example.com"
            />
          </div>
          <div>
            <label htmlFor="" className="block mb-2">
              Phone Number
            </label>
            <input name="phone" required defaultValue={initialData?.phone} placeholder="9000000001" />
          </div>
          {!isEditMode && (
            <div>
              <label htmlFor="" className="block mb-2">
                Temporary Password
              </label>
              <input
                type="password"
                name="password"
                required
                minLength={6}
                placeholder="One-time password"
              />
              <p className="text-xs text-slate-400 mt-1.5">
                The employee will be asked to set their own password on first login.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* employment details */}

      <div className="card p-5 sm:p-6">
        <h3 className="font-medium mb-6 pb-4 border-b border-slate-100">
          Employment Details
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm text-slate-700">
          <div>
            <label htmlFor="" className="block mb-2">
              Department
            </label>
            <select name="department" required defaultValue={initialData?.department || ""}>
              <option value="" disabled>Select department</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="" className="block mb-2">
              Position
            </label>
            <input name="position" required defaultValue={initialData?.position} placeholder="Software Developer" />
          </div>
          <div>
            <label htmlFor="" className="block mb-2">
              Join Date
            </label>
            <input
              type='date'
              name="joinDate"
              required
              defaultValue={initialData?.joinDate ? new Date(initialData.joinDate).toISOString().slice(0, 10) : ""}
            />
          </div>
          <div>
            <label htmlFor="" className="block mb-2">
              Employment Status
            </label>
            <select name="employmentStatus" required defaultValue={initialData?.employmentStatus || "ACTIVE"}>
              {EMPLOYMENT_STATUSES.map((status) => (
                <option key={status} value={status}>{status.replace("_", " ")}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* compensation */}

      <div className="card p-5 sm:p-6">
        <h3 className="font-medium mb-6 pb-4 border-b border-slate-100">
          Compensation
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-sm text-slate-700">
          <div>
            <label htmlFor="" className="block mb-2">
              Basic Salary
            </label>
            <input type="number" name="basicSalary" min="0" step="0.01" required defaultValue={initialData?.basicSalary} placeholder="0.00" />
          </div>
          <div>
            <label htmlFor="" className="block mb-2">
              Allowances
            </label>
            <input type="number" name="allowances" min="0" step="0.01" defaultValue={initialData?.allowances ?? 0} placeholder="0.00" />
          </div>
          <div>
            <label htmlFor="" className="block mb-2">
              Deductions
            </label>
            <input type="number" name="deductions" min="0" step="0.01" defaultValue={initialData?.deductions ?? 0} placeholder="0.00" />
          </div>
        </div>
      </div>

      {/* bio */}

      <div className="card p-5 sm:p-6">
        <h3 className="font-medium mb-6 pb-4 border-b border-slate-100">
          Bio
        </h3>
        <textarea
          name="bio"
          rows={3}
          defaultValue={initialData?.bio}
          placeholder="A short bio about the employee..."
        />
      </div>

      {/* actions */}

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
          {isEditMode ? "Update Employee" : "Create Employee"}
        </button>
      </div>
    </form>
  );
}

export default EmployeeForm
