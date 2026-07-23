import { useEffect } from "react"
import { useState } from "react"
import { dummyAdminDashboardData, dummyEmployeeDashboardData } from "../assets/assets"
import loading from "../components/LoadingLoader.jsx"
import LoadingLoader from "../components/LoadingLoader.jsx"
import EmployeeDashboard from "../components/EmployeeDashboard.jsx"
import AdminDashboard from "../components/AdminDashboard.jsx"

const Dashboard = () => {

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setData(dummyAdminDashboardData)
    setTimeout(() => {
      setLoading(false)
    },1000)
  }, [])
  
  if (loading) return <LoadingLoader/>
  if (!data) return <p className="text-center text-slate-500 py-12">Failed to load dashboard</p>
  if (data.role === "ADMIN") {
    return <AdminDashboard data={data} />
  } else {
    return <EmployeeDashboard data={data} />
  }
}
export default Dashboard
