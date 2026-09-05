import { Toaster } from 'react-hot-toast'
import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './pages/Layout'
import Dashboard from './pages/Dashboard.jsx'
import Employees from './pages/Employees'
import Attendance from './pages/Attendance'
import Leave from './pages/Leave'
import PaySlips from './pages/PaySlips'
import PrintPayslip from './pages/PrintPayslip'
import Settings from './pages/Settings.jsx'
import LoginLanding from './pages/LoginLanding.jsx'
import LoginForm from './components/LoginForm.jsx'
import { AdminRoute, ProtectedRoute } from './components/ProtectedRoute.jsx'

const App = () => {
  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/login" element={<LoginLanding />} />

        <Route path="/login/admin" element={<LoginForm role="ADMIN" title="Admin portal" subtitle="Sign in to manage the organization" />} />
        <Route path="/login/employee" element={<LoginForm role="EMPLOYEE" title="Employee portal" subtitle="Sign in to acces your account" />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route element={<AdminRoute />}>
              <Route path="/employees" element={<Employees />} />
            </Route>
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/leave" element={<Leave />} />
            <Route path="/payslips" element={<PaySlips />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
          <Route path="/print/payslips/:id" element={<PrintPayslip />} />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </>
  );
}

export default App
