const BASE_URL = import.meta.env.BACKEND_URI || "http://localhost:3000"
const TOKEN_KEY = "ems_token"
const ROLE_KEY = "ems_role"

export function getToken() {
    return localStorage.getItem(TOKEN_KEY)
}

export function getRole() {
    return localStorage.getItem(ROLE_KEY)
}

export function setSession(token, role) {
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(ROLE_KEY, role)
}

export function clearSession() {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(ROLE_KEY)
}

async function request(path, { method = "GET", body, params } = {}) {
    const url = new URL(BASE_URL + path)
    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
                url.searchParams.set(key, value)
            }
        })
    }

    const token = getToken()
    const headers = { "Content-Type": "application/json" }
    if (token) headers.Authorization = `Bearer ${token}`

    const res = await fetch(url, {
        method,
        headers,
        body: body !== undefined ? JSON.stringify(body) : undefined,
    })

    const isJson = res.headers.get("content-type")?.includes("application/json")
    const data = isJson ? await res.json().catch(() => null) : null

    if (!res.ok) {
        const message = Array.isArray(data?.message) ? data.message.join(", ") : data?.message
        throw new Error(message || `Request failed with status ${res.status}`)
    }

    return data
}

export const api = {
    get: (path, params) => request(path, { method: "GET", params }),
    post: (path, body) => request(path, { method: "POST", body }),
    put: (path, body) => request(path, { method: "PUT", body }),
    patch: (path, body) => request(path, { method: "PATCH", body }),
    del: (path) => request(path, { method: "DELETE" }),
}
