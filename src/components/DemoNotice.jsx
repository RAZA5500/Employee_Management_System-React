import React from 'react'
import { LockIcon } from 'lucide-react'

/** Amber "this is a locked demo account" callout. */
const DemoNotice = ({ children, className = "rounded-2xl p-4" }) => (
    <div className={`flex items-start gap-3 border border-amber-200 bg-amber-50 text-sm text-amber-800 ${className}`}>
        <LockIcon className="w-4 h-4 mt-0.5 shrink-0" />
        <p>{children}</p>
    </div>
)

export default DemoNotice
