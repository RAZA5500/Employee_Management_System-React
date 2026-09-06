import React, { useState } from 'react'
import { EyeIcon, EyeOffIcon } from 'lucide-react'

/**
 * Password field with its own show/hide toggle. Every other prop is forwarded
 * to the input, so it works both uncontrolled (name + FormData) and controlled
 * (value + onChange).
 */
const PasswordInput = ({ label, labelClassName = "block mb-2", className = "", ...inputProps }) => {

    const [show, setShow] = useState(false)

    return (
        <div>
            {label && <label className={labelClassName}>{label}</label>}
            <div className="relative">
                <input
                    type={show ? "text" : "password"}
                    className={`pr-11 ${className}`.trim()}
                    {...inputProps}
                />
                <button
                    type="button"
                    onClick={() => setShow(!show)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                    {show ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                </button>
            </div>
        </div>
    )
}

export default PasswordInput
