import { useEffect } from "react"
import { useState } from "react"
import { api } from "../api/client"
import LoadingLoader from "../components/LoadingLoader.jsx"
import EmployeeDashboard from "../components/EmployeeDashboard.jsx"
import AdminDashboard from "../components/AdminDashboard.jsx"

const Dashboard = () => {

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get("/dashboard")
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false))
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
