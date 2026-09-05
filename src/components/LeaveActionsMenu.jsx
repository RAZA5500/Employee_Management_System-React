import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { CheckCircle2Icon, ClockIcon, MoreVerticalIcon, PencilIcon, Trash2Icon, XCircleIcon } from 'lucide-react'
import { LEAVE_STATUSES } from '../assets/assets'

const STATUS_OPTIONS = {
    PENDING: { label: "Mark Pending", icon: ClockIcon, iconClassName: "bg-amber-50 text-amber-600" },
    APPROVED: { label: "Approve", icon: CheckCircle2Icon, iconClassName: "bg-emerald-50 text-emerald-600" },
    REJECTED: { label: "Reject", icon: XCircleIcon, iconClassName: "bg-rose-50 text-rose-600" },
}

const MENU_WIDTH = 208

const LeaveActionsMenu = ({ leave, isAdmin, onEdit, onChangeStatus, onDelete }) => {

    const [open, setOpen] = useState(false)
    const [position, setPosition] = useState({ top: 0, left: 0 })
    const buttonRef = useRef(null)
    const menuRef = useRef(null)

    const openMenu = () => {
        const rect = buttonRef.current.getBoundingClientRect()
        setPosition({
            top: rect.bottom + 6,
            left: Math.max(8, rect.right - MENU_WIDTH),
        })
        setOpen(true)
    }

    useEffect(() => {
        if (!open) return
        const handleClickOutside = (e) => {
            if (
                menuRef.current && !menuRef.current.contains(e.target) &&
                buttonRef.current && !buttonRef.current.contains(e.target)
            ) setOpen(false)
        }
        const handleScroll = () => setOpen(false)
        document.addEventListener("mousedown", handleClickOutside)
        window.addEventListener("scroll", handleScroll, true)
        window.addEventListener("resize", handleScroll)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
            window.removeEventListener("scroll", handleScroll, true)
            window.removeEventListener("resize", handleScroll)
        }
    }, [open])

    const runAction = (action) => {
        setOpen(false)
        action()
    }

    const statusOptions = LEAVE_STATUSES.filter((status) => status !== leave.status)

  return (
    <>
      <button
        ref={buttonRef}
        onClick={() => (open ? setOpen(false) : openMenu())}
        className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
          open ? "bg-slate-100 text-slate-700" : "text-slate-400 hover:text-slate-700 hover:bg-slate-100"
        }`}
      >
        <MoreVerticalIcon className="w-4 h-4" />
      </button>

      {open && createPortal(
        <div
          ref={menuRef}
          style={{ position: "fixed", top: position.top, left: position.left, width: MENU_WIDTH }}
          className="bg-white rounded-xl shadow-xl border border-slate-200/70 p-1.5 z-50 animate-fade-in origin-top-right"
        >
          {isAdmin && (
            <>
              <p className="px-2.5 pt-1 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400">
                Change Status
              </p>
              {statusOptions.map((status) => {
                const opt = STATUS_OPTIONS[status]
                return (
                  <button
                    key={status}
                    onClick={() => runAction(() => onChangeStatus(status))}
                    className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <span className={`p-1.5 rounded-md ${opt.iconClassName}`}>
                      <opt.icon className="w-3.5 h-3.5" />
                    </span>
                    {opt.label}
                  </button>
                );
              })}

              <div className="my-1.5 border-t border-slate-100" />
            </>
          )}

          <button
            onClick={() => runAction(onEdit)}
            className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <span className="p-1.5 rounded-md bg-indigo-50 text-indigo-600">
              <PencilIcon className="w-3.5 h-3.5" />
            </span>
            Edit request
          </button>
          <button
            onClick={() => runAction(onDelete)}
            className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-sm text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <span className="p-1.5 rounded-md bg-rose-50 text-rose-600">
              <Trash2Icon className="w-3.5 h-3.5" />
            </span>
            Delete request
          </button>
        </div>,
        document.body
      )}
    </>
  );
}

export default LeaveActionsMenu
