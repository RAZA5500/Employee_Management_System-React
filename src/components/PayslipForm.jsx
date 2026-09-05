import React, { useEffect, useState } from 'react'
import { Loader2Icon } from 'lucide-react'
import toast from 'react-hot-toast'
import { MONTH_NAMES } from '../assets/assets'
import { api } from '../api/client'

const currentYear = new Date().getFullYear()

const formatCurrency = (value) =>
  Number(value || 0).toLocaleString(undefined, { style: "currency", currency: "USD" })

const PayslipForm = ({ onSuccess, onCancel }) => {

  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(false)
  const [employeeId, setEmployeeId] = useState("")
  const [basicSalary, setBasicSalary] = useState("")
  const [allowances, setAllowances] = useState("")
  const [deductions, setDeductions] = useState("")

  useEffect(() => {
    api.get('/employees')
      .then(setEmployees)
      .catch((err) => toast.error(err.message || "Failed to load employees"))
  }, [])

  const netSalary = (Number(basicSalary) || 0) + (Number(allowances) || 0) - (Number(deductions) || 0)

  const handleEmployeeChange = (id) => {
    setEmployeeId(id)
    const emp = employees.find((e) => e.id === id)
    if (emp) {
      setBasicSalary(emp.basicSalary)
      setAllowances(emp.allowances)
      setDeductions(emp.deductions)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!employeeId) {
      toast.error("Please select an employee")
      return
    }

    setLoading(true)

    const formData = new FormData(e.target)
    const data = Object.fromEntries(formData.entries())

    const payslip = {
      employeeId,
      month: Number(data.month),
      year: Number(data.year),
      basicSalary: Number(basicSalary),
      allowances: Number(allowances) || 0,
      deductions: Number(deductions) || 0,
    }

    try {
      await api.post('/payslips', payslip)
      toast.success("Payslip generated")
      onSuccess()
    } catch (err) {
      toast.error(err.message || "Failed to generate payslip")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl animate-fade-in">
      <div className="card p-5 sm:p-6">
        <h3 className="font-medium mb-6 pb-4 border-b border-slate-100">
          Payslip Details
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm text-slate-700">
          <div className="sm:col-span-2">
            <label htmlFor="" className="block mb-2">
              Employee
            </label>
            <select
              name="employeeId"
              required
              value={employeeId}
              onChange={(e) => handleEmployeeChange(e.target.value)}
            >
              <option value="" disabled>Select employee</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.firstName} {emp.lastName} — {emp.position}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="" className="block mb-2">
              Month
            </label>
            <select name="month" required defaultValue="">
              <option value="" disabled>Select month</option>
              {MONTH_NAMES.map((name, i) => (
                <option key={name} value={i + 1}>{name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="" className="block mb-2">
              Year
            </label>
            <input type="number" name="year" required defaultValue={currentYear} min="2000" max="2100" />
          </div>
          <div>
            <label htmlFor="" className="block mb-2">
              Basic Salary
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              required
              value={basicSalary}
              onChange={(e) => setBasicSalary(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="" className="block mb-2">
              Allowances
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={allowances}
              onChange={(e) => setAllowances(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="" className="block mb-2">
              Deductions
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={deductions}
              onChange={(e) => setDeductions(e.target.value)}
            />
          </div>
          <div className="flex flex-col justify-end">
            <label className="block mb-2 text-slate-500">
              Net Salary
            </label>
            <p className="px-4 py-2.5 bg-emerald-50 border border-emerald-100 rounded-md text-emerald-700 font-medium">
              {formatCurrency(netSalary)}
            </p>
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
          Generate Payslip
        </button>
      </div>
    </form>
  );
}

export default PayslipForm
