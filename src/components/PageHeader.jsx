import React from 'react'

/** Page title + subtitle, with an optional action (button) on the right. */
const PageHeader = ({ title, subtitle, action }) => (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
            <h1 className="page-title">{title}</h1>
            <p className="page-subtitle">{subtitle}</p>
        </div>
        {action}
    </div>
)

export default PageHeader
