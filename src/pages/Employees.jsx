import React, { useCallback, useEffect } from 'react'
import { useState } from 'react'
import { api } from '../api/client'
import { Plus, Search } from 'lucide-react'
import { DEPARTMENTS } from '../assets/assets'
import EmployeeCard from '../components/EmployeeCard'
import EmployeeForm from '../components/EmployeeForm'
import EmptyState from '../components/EmptyState'
import Modal from '../components/Modal'
import PageHeader from '../components/PageHeader'
import toast from 'react-hot-toast'

const Employees = () => {

  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [selectedDepart, setSelectedDepart] = useState("")
  const [editEmployee, setEditEmployee] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)

  const fetchEmployees = useCallback(async () => {
    setLoading(true)
    try {
      const data = await api.get('/employees', { department: selectedDepart })
      setEmployees(data)
    } catch (err) {
      toast.error(err.message || "Failed to load employees")
    } finally {
      setLoading(false)
    }
  }, [selectedDepart])

  useEffect(() => {
    fetchEmployees()
  }, [fetchEmployees])

  const handleCreateEmployee = () => {
    setShowCreateModal(false)
    fetchEmployees()
  }

  const handleUpdateEmployee = () => {
    setEditEmployee(null)
    fetchEmployees()
  }

  const handleDeleteEmployee = async (id) => {
    try {
      await api.del(`/employees/${id}`)
      toast.success("Employee deleted successfully")
      fetchEmployees()
    } catch (err) {
      toast.error(err.message || "Failed to delete employee")
    }
  }

  const filtered = employees.filter((emp)=> `${emp.firstName} ${emp.lastName} ${emp.position}`.toLowerCase().includes(search.toLocaleLowerCase()))

  return (
    <div className="animate-fade-in">
      {/* ==== header ==== */}

      <PageHeader
        title="Employees"
        subtitle="Manage your team member"
        action={
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            <Plus size={16} /> Add Employee
          </button>
        }
      />

      {/* ==== search bar ==== */}

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search employees..."
            className="w-full pl-10"
            onChange={(e) => setSearch(e.target.value)}
            value={search}
          />
        </div>
        <select
          value={selectedDepart}
          onChange={(e) => {
            setSelectedDepart(e.target.value);
          }}
          className="max-w-40"
        >
          <option value="">All Departments</option>
          {DEPARTMENTS.map((deptName) => (
            <option key={deptName} value={deptName}>
              {deptName}
            </option>
          ))}
        </select>
      </div>

      {/* ==== employee card ==== */}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="card overflow-hidden">
              <div className="skeleton aspect-4/3 w-full rounded-none" />
              <div className="p-5 space-y-2.5">
                <div className="skeleton h-4 w-2/3" />
                <div className="skeleton h-3 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {filtered.length === 0 ? (
            <EmptyState message="No employees found" className="col-span-full" />
          ) : (
            filtered.map((emp) => (
              <EmployeeCard
                key={emp.id}
                employee={emp}
                onDelete={() => handleDeleteEmployee(emp.id)}
                onEdit={(e) => setEditEmployee(e)}
              />
            ))
          )}
        </div>
      )}

      {/* create employee modal */}

      <Modal
        open={showCreateModal}
        title="Add New Employee"
        subtitle="Create a user accound and employee profile"
        onClose={() => setShowCreateModal(false)}
      >
        <EmployeeForm
          onSuccess={handleCreateEmployee}
          onCancel={() => setShowCreateModal(false)}
        />
      </Modal>

      {/* edit employee modal */}

      <Modal
        open={!!editEmployee}
        title="Edit Employee"
        subtitle="Update employee details"
        onClose={() => setEditEmployee(null)}
      >
        <EmployeeForm
          initialData={editEmployee}
          onSuccess={handleUpdateEmployee}
          onCancel={() => setEditEmployee(null)}
        />
      </Modal>
    </div>
  );
}

  export default Employees
