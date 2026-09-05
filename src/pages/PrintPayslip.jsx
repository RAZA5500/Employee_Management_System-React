import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeftIcon, PrinterIcon } from 'lucide-react'
import { api } from '../api/client'
import { MONTH_NAMES } from '../assets/assets'
import LoadingLoader from '../components/LoadingLoader.jsx'

const formatCurrency = (value) =>
  Number(value || 0).toLocaleString(undefined, { style: "currency", currency: "USD" })

const PrintPayslip = () => {

  const { id } = useParams()
  const navigate = useNavigate()
  const [payslip, setPayslip] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/payslips/${id}`)
      .then(setPayslip)
      .catch(() => setPayslip(null))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <LoadingLoader />

  if (!payslip) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="text-center">
          <p className="text-slate-500 mb-4">Payslip not found</p>
          <button onClick={() => navigate(-1)} className="btn-secondary">Go Back</button>
        </div>
      </div>
    );
  }

  const emp = payslip.employeeId

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4">
      <div className="max-w-2xl mx-auto mb-4 flex items-center justify-between print:hidden">
        <button onClick={() => navigate(-1)} className="btn-secondary flex items-center gap-2">
          <ArrowLeftIcon size={16} /> Back
        </button>
        <button onClick={() => window.print()} className="btn-primary flex items-center gap-2">
          <PrinterIcon size={16} /> Print
        </button>
      </div>

      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200/70 p-6 sm:p-8 md:p-10 print:shadow-none print:border-none print:rounded-none">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">Payslip</h1>
            <p className="text-sm text-slate-500 mt-1">{MONTH_NAMES[payslip.month - 1]} {payslip.year}</p>
          </div>
          <div className="sm:text-right">
            <p className="text-sm font-semibold text-slate-900">Your Company Inc.</p>
            <p className="text-xs text-slate-500">123 Business Ave, Suite 100</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-6 border-b border-slate-100 text-sm">
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-400 mb-1">Employee</p>
            <p className="font-medium text-slate-900">{emp?.firstName} {emp?.lastName}</p>
            <p className="text-slate-500">{emp?.position}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-400 mb-1">Department</p>
            <p className="font-medium text-slate-900">{emp?.department}</p>
            <p className="text-slate-500">{emp?.email}</p>
          </div>
        </div>

        <div className="py-6">
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b border-slate-100">
                <td className="py-2.5 text-slate-500">Basic Salary</td>
                <td className="py-2.5 text-right font-medium text-slate-900">{formatCurrency(payslip.basicSalary)}</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-2.5 text-slate-500">Allowances</td>
                <td className="py-2.5 text-right font-medium text-emerald-700">+ {formatCurrency(payslip.allowances)}</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-2.5 text-slate-500">Deductions</td>
                <td className="py-2.5 text-right font-medium text-rose-700">- {formatCurrency(payslip.deductions)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between pt-4 border-t-2 border-slate-900">
          <p className="font-semibold text-slate-900">Net Salary</p>
          <p className="text-xl font-bold text-slate-900">{formatCurrency(payslip.netSalary)}</p>
        </div>

        <p className="text-xs text-slate-400 text-center mt-8">
          This is a system-generated payslip and does not require a signature.
        </p>
      </div>
    </div>
  );
}

export default PrintPayslip
