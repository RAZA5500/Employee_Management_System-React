import React, { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, PrinterIcon, ReceiptIcon, Search, Trash2Icon, UsersIcon, WalletIcon, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { api } from '../api/client'
import { useAuth } from '../context/AuthContext'
import { MONTH_NAMES } from '../assets/assets'
import PayslipForm from '../components/PayslipForm'
import ConfirmDialog from '../components/ConfirmDialog'

const formatCurrency = (value) =>
  Number(value || 0).toLocaleString(undefined, { style: "currency", currency: "USD" })

const PaySlips = () => {

  const { role } = useAuth()
  const isAdmin = role === "ADMIN"
  const [allPayslips, setAllPayslips] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [selectedMonth, setSelectedMonth] = useState("")
  const [selectedYear, setSelectedYear] = useState("")
  const [showGenerateModal, setShowGenerateModal] = useState(false)
  const [deletePayslipId, setDeletePayslipId] = useState(null)

  const fetchPayslips = useCallback(async () => {
    setLoading(true)
    try {
      const data = await api.get('/payslips')
      setAllPayslips(data)
    } catch (err) {
      toast.error(err.message || "Failed to load payslips")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPayslips()
  }, [fetchPayslips])

  const years = [...new Set(allPayslips.map((p) => p.year))].sort((a, b) => b - a)

  const payslips = allPayslips.filter((p) => (
    (selectedMonth ? p.month === Number(selectedMonth) : true) &&
    (selectedYear ? p.year === Number(selectedYear) : true)
  ))

  const filtered = payslips.filter((p) => {
    const text = `${p.employeeId?.firstName} ${p.employeeId?.lastName} ${p.employeeId?.department}`.toLowerCase()
    return text.includes(search.toLowerCase())
  })

  const totalNetPaid = filtered.reduce((sum, p) => sum + (p.netSalary || 0), 0)
  const uniqueEmployees = new Set(filtered.map((p) => p.employeeId?.id)).size

  const handleGeneratePayslip = () => {
    setShowGenerateModal(false)
    fetchPayslips()
  }

  const handleDeletePayslip = async () => {
    try {
      await api.del(`/payslips/${deletePayslipId}`)
      toast.success("Payslip deleted")
      fetchPayslips()
    } catch (err) {
      toast.error(err.message || "Failed to delete payslip")
    } finally {
      setDeletePayslipId(null)
    }
  }

  return (
    <div className="animate-fade-in">
      {/* ==== header ==== */}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="page-title">Payslips</h1>
          <p className="page-subtitle">Generate and manage employee payslips</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setShowGenerateModal(true)}
            className="btn-primary flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            <Plus size={16} /> Generate Payslip
          </button>
        )}
      </div>

      {/* ==== stats ==== */}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 mb-6">
        <div className="card p-5 sm:p-6 relative overflow-hidden group flex items-center justify-between">
          <div className="absolute left-0 top-0 bottom-0 w-1 rounded-r-full bg-slate-500/70 group-hover:bg-indigo-500/70" />
          <div>
            <p className="text-sm font-medium text-slate-700">Payslips</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{filtered.length}</p>
          </div>
          <ReceiptIcon className="size-10 p-2.5 rounded-lg bg-slate-100 text-slate-600 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors duration-200" />
        </div>
        <div className="card p-5 sm:p-6 relative overflow-hidden group flex items-center justify-between">
          <div className="absolute left-0 top-0 bottom-0 w-1 rounded-r-full bg-slate-500/70 group-hover:bg-indigo-500/70" />
          <div>
            <p className="text-sm font-medium text-slate-700">Employees Paid</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{uniqueEmployees}</p>
          </div>
          <UsersIcon className="size-10 p-2.5 rounded-lg bg-slate-100 text-slate-600 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors duration-200" />
        </div>
        <div className="card p-5 sm:p-6 relative overflow-hidden group flex items-center justify-between">
          <div className="absolute left-0 top-0 bottom-0 w-1 rounded-r-full bg-slate-500/70 group-hover:bg-indigo-500/70" />
          <div>
            <p className="text-sm font-medium text-slate-700">Total Net Paid</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{formatCurrency(totalNetPaid)}</p>
          </div>
          <WalletIcon className="size-10 p-2.5 rounded-lg bg-slate-100 text-slate-600 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors duration-200" />
        </div>
      </div>

      {/* ==== search bar ==== */}

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by employee or department..."
            className="w-full pl-10"
            onChange={(e) => setSearch(e.target.value)}
            value={search}
          />
        </div>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="max-w-40"
        >
          <option value="">All Months</option>
          {MONTH_NAMES.map((name, i) => (
            <option key={name} value={i + 1}>{name}</option>
          ))}
        </select>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="max-w-32"
        >
          <option value="">All Years</option>
          {years.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      {/* ==== payslip table ==== */}

      {loading ? (
        <div className="card overflow-x-auto">
          <table className="table-modern">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Period</th>
                <th>Basic Salary</th>
                <th>Allowances</th>
                <th>Deductions</th>
                <th>Net Salary</th>
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
                  <td><div className="skeleton h-4 w-24" /></td>
                  <td><div className="skeleton h-4 w-20" /></td>
                  <td><div className="skeleton h-4 w-20" /></td>
                  <td><div className="skeleton h-4 w-20" /></td>
                  <td><div className="skeleton h-4 w-20" /></td>
                  <td><div className="skeleton h-4 w-16" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-center py-16 text-slate-400 bg-white rounded-2xl border-dashed border-slate-200">
          No payslips found
        </p>
      ) : (
        <div className="card overflow-x-auto">
          <table className="table-modern">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Period</th>
                <th>Basic Salary</th>
                <th>Allowances</th>
                <th>Deductions</th>
                <th>Net Salary</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id}>
                  <td>
                    <p className="font-medium text-slate-900">
                      {p.employeeId?.firstName} {p.employeeId?.lastName}
                    </p>
                    <p className="text-xs text-slate-500">{p.employeeId?.department}</p>
                  </td>
                  <td>{MONTH_NAMES[p.month - 1]} {p.year}</td>
                  <td>{formatCurrency(p.basicSalary)}</td>
                  <td>{formatCurrency(p.allowances)}</td>
                  <td>{formatCurrency(p.deductions)}</td>
                  <td className="font-semibold text-emerald-700">{formatCurrency(p.netSalary)}</td>
                  <td>
                    <div className="flex items-center gap-1">
                      <Link
                        to={`/print/payslips/${p.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="View / Print"
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
                      >
                        <PrinterIcon className="w-4 h-4" />
                      </Link>
                      {isAdmin && (
                        <button
                          onClick={() => setDeletePayslipId(p.id)}
                          title="Delete"
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 transition-colors"
                        >
                          <Trash2Icon className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* generate payslip modal */}

      {showGenerateModal && (
        <div
          onClick={() => setShowGenerateModal(false)}
          className="fixed bg-black/40 backdrop-blur-sm inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto"
        >
          <div
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-8 animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 pb-0">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Generate Payslip</h2>
                <p className="text-sm text-slate-500 mt-0.5">Create a new payslip for an employee</p>
              </div>
              <button
                onClick={() => setShowGenerateModal(false)}
                className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5 text-rose-600" />
              </button>
            </div>
            <div className="p-6">
              <PayslipForm onSuccess={handleGeneratePayslip} onCancel={() => setShowGenerateModal(false)} />
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deletePayslipId}
        title="Delete payslip"
        message="Are you sure you want to delete this payslip? This action cannot be undone."
        onConfirm={handleDeletePayslip}
        onCancel={() => setDeletePayslipId(null)}
      />
    </div>
  );
}

export default PaySlips
