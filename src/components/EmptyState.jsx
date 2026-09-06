import React from 'react'

/** Placeholder shown when a list or table has no rows. */
const EmptyState = ({ message, className = "" }) => (
    <p className={`text-center py-16 text-slate-400 bg-white rounded-2xl border-dashed border-slate-200 ${className}`.trim()}>
        {message}
    </p>
)

export default EmptyState
