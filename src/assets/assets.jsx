export const DEPARTMENTS = ["Engineering", "Human Resources", "Marketing", "Sales", "Finance", "Operations", "IT Support", "Customer Success", "Product Management", "Design"];

export const LEAVE_TYPES = ["ANNUAL", "CASUAL", "SICK", "UNPAID"];

export const LEAVE_STATUSES = ["PENDING", "APPROVED", "REJECTED"];

// Shared demo/test accounts. Their credentials are published in the README, so
// their name, email and password stay fixed — the API rejects any change too,
// this list only lets the UI warn before the request goes out.
export const DEMO_ACCOUNT_EMAILS = (
    import.meta.env.VITE_DEMO_ACCOUNT_EMAILS || "admin@gmail.com,employee@gmail.com"
).split(",").map((email) => email.trim().toLowerCase()).filter(Boolean);

export const DEMO_LOCK_MESSAGE = "Demo account — name, email and password can't be changed";

export const DEMO_DELETE_MESSAGE = "Demo account — this account can't be deleted";

export function isDemoAccount(email) {
    if (!email) return false;
    return DEMO_ACCOUNT_EMAILS.includes(email.trim().toLowerCase());
}

export const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];

export function getWorkingHoursDisplay(record) {
    if (record.workingHours != null) {
        const hrs = Math.floor(record.workingHours);
        const mins = Math.round((record.workingHours - hrs) * 60);
        return `${hrs}h ${mins}m`;
    }
    // If still checked in (no checkout), compute live hours
    if (record.checkIn && !record.checkOut) {
        const diffMs = Date.now() - new Date(record.checkIn).getTime();
        const diffHours = diffMs / (1000 * 60 * 60);
        const hrs = Math.floor(diffHours);
        const mins = Math.round((diffHours - hrs) * 60);
        return `${hrs}h ${mins}m (ongoing)`;
    }
    return "—";
}

export function getDayTypeDisplay(record) {
    if (record.dayType) {
        const map = {
            "Full Day": "badge-success",
            "Three Quarter Day": "bg-blue-100 text-blue-700",
            "Half Day": "badge-warning",
            "Short Day": "badge-danger",
        };
        return {
            label: record.dayType,
            className: map[record.dayType] || "bg-slate-100 text-slate-600",
        };
    }
    if (record.checkIn && !record.checkOut) {
        return { label: "In Progress", className: "bg-indigo-100 text-indigo-700" };
    }
    return { label: "—", className: "" };
}
