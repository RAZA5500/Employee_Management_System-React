import React, { useEffect } from 'react'
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon, DollarSignIcon, FileTextIcon, LayoutGridIcon, LogOutIcon, MenuIcon, SettingsIcon, UserIcon, XIcon } from 'lucide-react'

const SideBar = () => {
    const { pathname } = useLocation()
    const navigate = useNavigate()
    const { role, profile, logout } = useAuth()
    const [mobileOpen, setMobileOpen] = useState(false)
    const [collapsed, setCollapsed] = useState(false)
    const userName = profile ? `${profile.fName} ${profile.lName}` : ''

    // closee mobile side bar on route changee

    useEffect(() => {
      setMobileOpen(false)
    }, [pathname]);

    const navItems = [
        { name: "Dashboard", href: "/dashboard", icon: LayoutGridIcon },
        ...(role === "ADMIN" ? [{ name: "Employees", href: "/employees", icon: UserIcon }] : []),
        { name: "Attendance", href: "/attendance", icon: CalendarIcon },
        { name: "Leave", href: "/leave", icon: FileTextIcon },
        { name: "Payslips", href: "/payslips", icon: DollarSignIcon },
        { name: "Settings", href: "/settings", icon: SettingsIcon },
    ]

    const handleLogout = () => {
        logout()
        toast.success("Logged out successfully")
        navigate("/login")
    }

    const renderSideBarContent = (collapsed) => (
      <>
        {/* Brand Header */}

        <div className="px-5 pt-6 pb-5 border-b border-white/6">
          <div className={`flex items-center ${collapsed ? "justify-center" : "justify-between"}`}>
            <div className={`flex items-center ${collapsed ? "" : "gap-3"}`}>
              <UserIcon className="text-white size-7 shrink-0" />
              {!collapsed && (
                <div>
                  <p className="font-semibold text-[13px] text-white tracking-wide whitespace-nowrap">
                    Employee MS
                  </p>
                  <p className="text-[11px] text-slate-500 font-medium whitespace-nowrap">
                    Management System
                  </p>
                </div>
              )}
                    </div>
                    {/* close button on mobile */}

                    {!collapsed && (
                      <button onClick={()=> setMobileOpen(false)} className='lg:hidden text-slate-400 hover:text-white p-1 cursor-pointer'>
                          <XIcon size={20} />
                      </button>
                    )}
          </div>
        </div>

        {/* useer profilee card */}

            {userName && (
                <div className={`mx-3 mt-4 mb-1 rounded-lg bg-white/3 border border-white/4 ${collapsed ? "p-2 flex justify-center" : "p-3"}`}>
                    <div className={`flex items-center ${collapsed ? "" : "gap-3"}`}>
                        <div className='w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center ring-1 ring-white/10 shrink-0'>
                            <span className='text-slate-400 text-xs font-semibold'>
                                {userName.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        {!collapsed && (
                          <div className='min-w-0'>
                              <p className='text-[13px] font-medium text-slate-200x truncate'>{userName}</p>
                              <p className='text-[11px] text-slate-500 truncate'>{role === "ADMIN" ? "Administrator" : "Employee"}</p>
                          </div>
                        )}
                    </div>
                </div>
            )}

        {/* section labell */}

        {!collapsed && (
          <div className='px-5 pt-5 pb-2'>
              <p className='text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500'>Navigation</p>
          </div>
        )}

        {/* nav list */}

            <div className={`flex-1 flex flex-col p-3 space-y-0.5 overflow-y-auto min-h-0 ${collapsed ? "mt-2" : ""}`}>
                {navItems.map((item) => {
                    const isActive = pathname?.startsWith(item.href)

                    return (
                      <Link
                            key={item.href}
                            to={item.href}
                            title={collapsed ? item.name : undefined}
                            className={`group flex items-center px-3 py-2.5 rounded-md text-[13px] font-medium transition-all duration-150 relative ${collapsed ? "justify-center" : "gap-3"} ${isActive ? "bg-indigo-500/12 text-indigo-300" : "text-slate-300 hover:text-white hover:bg-white/4"}`}
                      >
                        {isActive && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.75 h-5 rounded-r-full bg-indigo-500" />
                        )}
                        <item.icon
                          className={`w-4.25 h-4.25 shrink-0 ${isActive ? "text-indigo-300" : "text-slate-400 group-hover:text-slate-300"}`}
                        />
                        {!collapsed && <span className="flex-1">{item.name}</span>}
                        {!collapsed && isActive && (
                          <ChevronRightIcon className="w-3.5 h-3.5 text-indigo-500/50" />
                        )}
                      </Link>
                    );
                })}
            </div>

            {/* Logout */}

            <div className='p-3 border-t border-white/6 shrink-0'>
                <button
                  onClick={handleLogout}
                  title={collapsed ? "Log out" : undefined}
                  className={`flex items-center w-full px-3 py-2.5 rounded-md text-[13px] font-medium text-slate-400 hover:text-rose-300 hover:bg-rose-500/20 cursor-pointer transition-all duration-150 ${collapsed ? "justify-center" : "gap-3"}`}
                >
                    <LogOutIcon className='w-4.25 h-4.25 shrink-0' />
                    {!collapsed && <span>Log out</span>}
                </button>
            </div>

      </>
    );
  return (
    <>
      {/* mbile hamburgerer button */}

      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-slate-900 text-white rounded-lg shadow-lg border border-white/10 cursor-pointer"
      >
        <MenuIcon size={20} />
      </button>

      {/* mobile overlay */}

      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* SideBar - dekstop */}

      <aside className={`hidden lg:flex flex-col h-full relative bg-linear-to-b from-slate-900 via-slate-900 to-slate-950 text-white shrink-0 border-r border-white/4 transition-all duration-300 ${collapsed ? "w-20" : "w-65"}`}>
        {renderSideBarContent(collapsed)}

        {/* collapse/expand toggle */}

        <button
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="absolute top-8 -right-3 w-6 h-6 rounded-full bg-slate-800 border border-white/10 text-slate-300 hover:text-white hover:bg-slate-700 cursor-pointer flex items-center justify-center shadow-md transition-all duration-150 z-10"
        >
          {collapsed ? <ChevronRightIcon size={14} /> : <ChevronLeftIcon size={14} />}
        </button>
      </aside>

      {/* SideBar - mobile */}

      <aside
        className={`lg:hidden fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-linear-to-b from-slate-900 via-slate-900 to-slate-950 text-white z-50 flex flex-col transform transition-transform duration-300 ${mobileOpen ? "translate-x-0" : "-translate-x-full"} `}
      >
        {renderSideBarContent(false)}
      </aside>
    </>
  );
}

export default SideBar
